MorphSVGPlugin.convertToPath('polygon');
var xmlns = 'http://www.w3.org/2000/svg',
  xlinkns = 'http://www.w3.org/1999/xlink',
  select = function(s) {
    return document.querySelector(s);
  },
  selectAll = function(s) {
    return document.querySelectorAll(s);
  },
  pContainer = select('.pContainer'),
  mainSVG = select('.mainSVG'),
  star = select('#star'),
  sparkle = select('.sparkle'),
  tree = select('#tree'),
  showParticle = true,
  particleColorArray = [
    '#E8F6F8',
    '#ACE8F8',
    '#F6FBFE',
    '#A2CBDC',
    '#B74551',
    '#5DBA72',
    '#910B28',
    '#910B28',
    '#446D39',
  ],
  particleTypeArray = ['#star', '#circ', '#cross', '#heart'],
  // particleTypeArray = ['#star'],
  particlePool = [],
  particleCount = 0,
  numParticles = 201;

gsap.set('svg', {
  visibility: 'visible',
});

gsap.set(sparkle, {
  transformOrigin: '50% 50%',
  y: -100,
});

let getSVGPoints = (path) => {
  let arr = [];
  var rawPath = MotionPathPlugin.getRawPath(path)[0];
  rawPath.forEach((el, value) => {
    let obj = {};
    obj.x = rawPath[value * 2];
    obj.y = rawPath[value * 2 + 1];
    if (value % 2) {
      arr.push(obj);
    }
    //console.log(value)
  });

  return arr;
};
let treePath = getSVGPoints('.treePath');

var treeBottomPath = getSVGPoints('.treeBottomPath');

//console.log(starPath.length)
var mainTl = gsap.timeline({ delay: 0, repeat: 0 }),
  starTl;

//tl.seek(100).timeScale(1.82)

function flicker(p) {
  //console.log("flivker")
  gsap.killTweensOf(p, { opacity: true });
  gsap.fromTo(
    p,
    {
      opacity: 1,
    },
    {
      duration: 0.07,
      opacity: Math.random(),
      repeat: -1,
    }
  );
}

function createParticles() {
  //var step = numParticles/starPath.length;
  //console.log(starPath.length)
  var i = numParticles,
    p,
    particleTl,
    step = numParticles / treePath.length,
    pos;
  while (--i > -1) {
    p = select(particleTypeArray[i % particleTypeArray.length]).cloneNode(true);
    mainSVG.appendChild(p);
    p.setAttribute('fill', particleColorArray[i % particleColorArray.length]);
    p.setAttribute('class', 'particle');
    particlePool.push(p);
    //hide them initially
    gsap.set(p, {
      x: -100,
      y: -100,
      transformOrigin: '50% 50%',
    });
  }
}

var getScale = gsap.utils.random(0.5, 3, 0.001, true);

function playParticle(p) {
  if (!showParticle) {
    return;
  }
  var p = particlePool[particleCount];
  gsap.set(p, {
    x: gsap.getProperty('.pContainer', 'x'),
    y: gsap.getProperty('.pContainer', 'y'),
    scale: getScale(),
  });
  var tl = gsap.timeline();
  tl.to(p, {
    duration: gsap.utils.random(0.61, 6),
    physics2D: {
      velocity: gsap.utils.random(-23, 23),
      angle: gsap.utils.random(-180, 180),
      gravity: gsap.utils.random(-6, 50),
    },
    scale: 0,
    rotation: gsap.utils.random(-123, 360),
    ease: 'power1',
    onStart: flicker,
    onStartParams: [p],
    //repeat:-1,
    onRepeat: (p) => {
      gsap.set(p, {
        scale: getScale(),
      });
    },
    onRepeatParams: [p],
  });

  //
  //particlePool[particleCount].play();
  particleCount++;
  //mainTl.add(tl, i / 1.3)
  particleCount = particleCount >= numParticles ? 0 : particleCount;
}

function drawStar() {
  starTl = gsap.timeline({ onUpdate: playParticle });
  starTl
    .to('.pContainer, .sparkle', {
      duration: 6,
      motionPath: {
        path: '.treePath',
        autoRotate: false,
      },
      ease: 'linear',
    })
    .to('.pContainer, .sparkle', {
      duration: 1,
      onStart: function() {
        showParticle = false;
      },
      x: treeBottomPath[0].x,
      y: treeBottomPath[0].y,
    })
    .to(
      '.pContainer, .sparkle',
      {
        duration: 2,
        onStart: function() {
          showParticle = true;
        },
        motionPath: {
          path: '.treeBottomPath',
          autoRotate: false,
        },
        ease: 'linear',
      },
      '-=0'
    )
    .from(
      '.treeBottomMask',
      {
        duration: 2,
        drawSVG: '0% 0%',
        stroke: '#FFF',
        ease: 'linear',
      },
      '-=2'
    );

  //gsap.staggerTo(particlePool, 2, {})
}

createParticles();
drawStar();
//ScrubGSAPTimeline(mainTl)

mainTl
  .from(['.treePathMask', '.treePotMask'], {
    duration: 6,
    drawSVG: '0% 0%',
    stroke: '#FFF',
    stagger: {
      each: 6,
    },
    duration: gsap.utils.wrap([6, 1, 2]),
    ease: 'linear',
  })
  .from(
    '.treeStar',
    {
      duration: 3,
      //skewY:270,
      scaleY: 0,
      scaleX: 0.15,
      transformOrigin: '50% 50%',
      ease: 'elastic(1,0.5)',
    },
    '-=4'
  )

  .to(
    '.sparkle',
    {
      duration: 3,
      opacity: 0,
      ease:
        'rough({strength: 2, points: 100, template: linear, taper: both, randomize: true, clamp: false})',
    },
    '-=0'
  )
  .to(
    '.treeStarOutline',
    {
      duration: 1,
      opacity: 1,
      ease:
        'rough({strength: 2, points: 16, template: linear, taper: none, randomize: true, clamp: false})',
    },
    '+=1'
  );
/* .to('.whole', {
  opacity: 0
}, '+=2') */
(async function() {
  try {
    mainTl.add(starTl, 0);
    const svgEle = document.querySelector('.mainSVG');
    setTimeout(() => svgEle && svgEle.remove(), 8000);
    await gsap.globalTimeline.timeScale(1.5);
  } catch (error) {
    console.error('🚀 ~ file: script.js ~ line 254 ~ error', error);
  }
})();

var text = ['#paths_for_happynew', '#paths_for_coding'];
var paths_Orgament = document.querySelectorAll('#ornament path');

//for Orgament only animation
var tl_Orgament = gsap.timeline({ repeat: -1, repeatRefresh: true });

//I determine edges of the screen -  a space in which will Orgament paths be visible on the screen (when they find themselves in that space)
var BBox = document.getElementById('ornament').getBBox();
var left = -(BBox.x + BBox.width);
var right = 1366 - BBox.x;
var up = -(BBox.y + BBox.height);
var down = 600 - BBox.y;

tl_Orgament.fromTo(
  paths_Orgament,
  {
    x: function() {
      var x = gsap.utils.random(-1500, 1500);
      if ((x > left) & (x < right)) {
        if (x < right / 2) x = left - 4000;
        else x = right + 7000;
      }
      return x;
    },
    y: function() {
      var y = gsap.utils.random(-1000, 1000);
      if ((y > up) & (y < down)) {
        if (y < down / 2) y = up - 100;
        else y = down + 100;
      }
      return y;
    },
    rotate: 'random(-360, 360)',
  },
  {
    x: 0,
    y: 0,
    rotation: 0,
    stagger: 0.01,
    ease: 'power2.out',
    duration: 4.35,
    repeat: 1,
    yoyo: true,
    repeatDelay: 1.7,
  }
);
tl_Orgament.to(
  '.parcel',
  { scale: 1.7, fill: '#f8e105', stagger: 0.05, yoyo: true, repeat: 1, duration: 1 },
  4.3
);
tl_Orgament.fromTo(
  '#handle',
  { y: -500 },
  { y: 0, duration: 2, repeat: 1, yoyo: true, repeatDelay: 2.7 },
  2
);
//tl_Orgament.add(function () { tl_Orgament.invalidate().restart() });

//for Text only animation
var tl_Text = gsap.timeline({ repeat: -1, ease: 'none' });
tl_Text.set('#text_happy', { strokeDasharray: 1188, strokeDashoffset: 1188 });
tl_Text.set('#text_y', { strokeDasharray: 110, strokeDashoffset: 110 });
tl_Text.set('#text_dash', { strokeDasharray: 58, strokeDashoffset: 58 });
tl_Text.set('#text_new', { strokeDasharray: 556, strokeDashoffset: 556 });
tl_Text.set('#text_co', { strokeDasharray: 851, strokeDashoffset: 851 });
tl_Text.set('#text_ding', { strokeDasharray: 728, strokeDashoffset: 728 });
tl_Text.set('#text_dot', { strokeDasharray: 17, strokeDashoffset: 17 });
tl_Text.set('#text_g', { strokeDasharray: 264, strokeDashoffset: 264 });

//"happy new"
tl_Text.to('#text_happy', { strokeDashoffset: 0, duration: 2.5 }, 1.5);
tl_Text.to('#text_y', { strokeDashoffset: 0, duration: 0.3 }, '-=1');
tl_Text.to('#text_dash', { strokeDashoffset: 0, duration: 0.5 }, '-=2.3');
tl_Text.to('#text_new', { strokeDashoffset: 0, duration: 1.5 }, '-=0.8');

//"Coding"
tl_Text.to('#text_co', { strokeDashoffset: 0, duration: 1.5 });
tl_Text.to('#text_ding', { strokeDashoffset: 0, duration: 2.3 }, '-=1.3');
tl_Text.to('#text_dot', { strokeDashoffset: 0, duration: 0.2 }, '-=0.5');
tl_Text.to('#text_g', { strokeDashoffset: 0, duration: 0.5 }, '-=1.4');

//do nothing
tl_Text.to(text, { duration: 4.5 });
tl_Text.to(text, { autoAlpha: 0, duration: 1 }, 9.5);

//for Codepen Logo only animation
tl_Codepen = gsap.timeline({ repeat: -1, repeatRefresh: true });

tl_Codepen.to('#codepen', { opacity: 1, duration: 1.5 }, 4);
tl_Codepen.fromTo(
  '#feGaussianBlur',
  { attr: { stdDeviation: '8' } },
  { attr: { stdDeviation: '0' }, duration: 1 }
);

tl_Codepen.fromTo(
  '#codepen path',
  { x: 0, y: 0, rotate: 0 },
  {
    x: function() {
      var x = gsap.utils.random(0, 2500);
      if (x < right) x = right + 100;
      return x;
    },
    y: function() {
      var y = gsap.utils.random(-1000, 1000);
      if ((y > up) & (y < down)) {
        if (y < down / 2) y = up - 100;
        else y = down + 100;
      }
      return y;
    },
    rotate: 'random(-60, 60)',
    duration: 4,
    stagger: 0.01,
    ease: 'power2.out',
  },
  8.6
);

//cutting the long animation since it's not visible
tl_Codepen.add(function() {
  tl_Codepen.set('#codepen', { opacity: 0 });
  tl_Codepen.progress(1);
}, 11.68);

//gsap.globalTimeline.timeScale(2.5)
function audioAutoPlay() {
  var audio = document.getElementById('audio');
  console.log('🚀 ~ file: script.js ~ line 387 ~ audioAutoPlay ~ audio', audio);
  audio.play();
}
audioAutoPlay();
