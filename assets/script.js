
(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Topbar show/hide */
  var topbar = document.getElementById('topbar');
  var hero = document.querySelector('.hero');
  var topbarObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      topbar.classList.toggle('is-visible', !entry.isIntersecting);
    });
  }, { rootMargin: '-10% 0px 0px 0px' });
  if (hero) topbarObserver.observe(hero);

  /* Section reveal */
  var sections = document.querySelectorAll('section[id]');
  var revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  sections.forEach(function(s){
    if (reduceMotion) { s.classList.add('is-visible'); }
    else { revealObserver.observe(s); }
  });

  /* Scrollspy: highlight active waypoint in both nav rails */
  var navItems = document.querySelectorAll('#routeNav li, #mobileRouteNav li');
  function setActive(id){
    navItems.forEach(function(li){
      li.classList.toggle('active', li.getAttribute('data-target') === id);
    });
    var activeMobile = document.querySelector('#mobileRouteNav li.active a');
    if (activeMobile) activeMobile.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' });
  }
  var spyObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });
  sections.forEach(function(s){ spyObserver.observe(s); });
  
  // Set initial active state
  setActive('intro');

  /* Progress dot along the desktop route line */
  var progress = document.getElementById('routeProgress');
  var nav = document.getElementById('routeNav');
  function updateProgress(){
    if (!progress || !nav || window.innerWidth <= 880) return;
    var main = document.getElementById('main');
    var rect = main.getBoundingClientRect();
    var total = main.offsetHeight - window.innerHeight * 0.5;
    var scrolled = -rect.top;
    var fraction = Math.min(1, Math.max(0, scrolled / total));
    var navHeight = nav.offsetHeight;
    progress.style.height = (fraction * navHeight) + 'px';
  }
  var ticking = false;
  window.addEventListener('scroll', function(){
    if (!ticking){
      window.requestAnimationFrame(function(){ updateProgress(); ticking = false; });
      ticking = true;
    }
  });
  window.addEventListener('resize', updateProgress);
  updateProgress();
})();