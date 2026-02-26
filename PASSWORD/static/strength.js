const socket = io();

function checkStrength() {
    const pwd = document.getElementById('passwordInput').value;
    if (pwd.length === 0) {
        document.getElementById('strengthMeter').innerHTML = '<div></div>';
        document.getElementById('strengthText').textContent = '';
        return;
    }
    socket.emit('check_password', { password: pwd });

    socket.on('strength_update', function(data) {
        const score = data.score;
        const meter = document.getElementById('strengthMeter');
        const text = document.getElementById('strengthText');
        meter.innerHTML = '<div></div>';
        const bar = meter.querySelector('div');

        let color = '#ff4d4d';
        if (score > 80) color = '#00ff88';
        else if (score > 50) color = '#ffd700';

        bar.style.width = `${score}%`;
        bar.style.background = `linear-gradient(90deg, #ff4d4d, ${color})`;
        text.textContent = `Strength: ${score}% | Entropy: ${data.entropy} | Suggestion: ${data.ai_suggestion}`;
    });
}