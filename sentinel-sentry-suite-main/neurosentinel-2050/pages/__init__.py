"""Pages package initializer: expose submodules (modules) so callers get module objects
with a `render()` function. Avoid importing `render` directly which would expose a
function object and break calls to `page.render()` in the launcher.
"""
from . import home
from . import phishing
from . import malware
from . import intrusion
from . import ransomware
from . import ddos
from . import insider
from . import threat_intel
from . import fusion
from . import explainable_ai
from . import predictive
from . import soar
from . import quantum
from . import red_blue
from . import soc_copilot
from . import global_map
from . import network_security

__all__ = [
	"home",
	"phishing",
	"malware",
	"intrusion",
	"ransomware",
	"ddos",
	"insider",
	"threat_intel",
	"fusion",
	"explainable_ai",
	"predictive",
	"soar",
	"quantum",
	"red_blue",
	"soc_copilot",
	"global_map",
	"network_security",
]
