function getSoundLevel(id, level) {
    if (level > 0) {
        var el = document.getElementById('ball');
        el.style.transform = 'translateY(' + -level + 'px)';
    }
}
