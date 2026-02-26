import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export const useThreats = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch threats
  const { data: threats, isLoading } = useQuery({
    queryKey: ["threats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("threats")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("threats-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "threats",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["threats"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Analyze threat with AI
  const analyzeThreat = useMutation({
    mutationFn: async (threat: any) => {
      const { data, error } = await supabase.functions.invoke("analyze-threat", {
        body: { threat },
      });

      if (error) throw error;
      return data;
    },
    onError: (error: any) => {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    threats,
    isLoading,
    analyzeThreat: analyzeThreat.mutate,
    isAnalyzing: analyzeThreat.isPending,
  };
};