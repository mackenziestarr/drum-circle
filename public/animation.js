function getSoundLevel(el, level) {
    if (level > 0) {
        el.style.transform = 'translateY(' + -level + 'px)';
    } else {
        el.style.transform = null;
    }
}
