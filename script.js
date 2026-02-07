$(document).ready(function () {

  // =====================
  // PRELOADER
  // =====================
  $(window).on('load', function () {
    setTimeout(function () {
      $('#preloader').addClass('loaded');
    }, 1500);
  });

  // Fallback if load event already fired
  setTimeout(function () {
    $('#preloader').addClass('loaded');
  }, 3000);

  // =====================
  // NAVBAR SCROLL EFFECT
  // =====================
  var $navbar = $('#navbar');
  var $backToTop = $('#backToTop');

  $(window).on('scroll', function () {
    var scrollTop = $(this).scrollTop();

    // Navbar background
    if (scrollTop > 80) {
      $navbar.addClass('scrolled');
    } else {
      $navbar.removeClass('scrolled');
    }

    // Back to top button
    if (scrollTop > 600) {
      $backToTop.addClass('visible');
    } else {
      $backToTop.removeClass('visible');
    }

    // Active nav link based on section
    updateActiveNav(scrollTop);
  });

  // =====================
  // SMOOTH SCROLL NAV
  // =====================
  $('a[href^="#"]').on('click', function (e) {
    e.preventDefault();
    var target = $(this.getAttribute('href'));
    if (target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top - 70
      }, 800, 'swing');
    }
    // Close mobile nav
    $('#navLinks').removeClass('open');
    $('#hamburger').removeClass('active');
  });

  $backToTop.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 800);
  });

  function updateActiveNav(scrollTop) {
    var sections = ['#home', '#about', '#courses', '#features', '#testimonials', '#contact'];
    sections.forEach(function (sectionId) {
      var $section = $(sectionId);
      if ($section.length) {
        var top = $section.offset().top - 150;
        var bottom = top + $section.outerHeight();
        if (scrollTop >= top && scrollTop < bottom) {
          $('.nav-links a').removeClass('active');
          $('.nav-links a[href="' + sectionId + '"]').addClass('active');
        }
      }
    });
  }

  // =====================
  // MOBILE HAMBURGER
  // =====================
  $('#hamburger').on('click', function () {
    $(this).toggleClass('active');
    $('#navLinks').toggleClass('open');
  });

  // Close menu on clicking outside
  $(document).on('click', function (e) {
    if (!$(e.target).closest('#navLinks, #hamburger').length) {
      $('#navLinks').removeClass('open');
      $('#hamburger').removeClass('active');
    }
  });

  // =====================
  // PARALLAX EFFECT ON HERO
  // =====================
  $(window).on('scroll', function () {
    var scrollTop = $(this).scrollTop();
    var $heroBg = $('.hero-parallax-bg');
    if ($heroBg.length) {
      $heroBg.css('transform', 'translateY(' + scrollTop * 0.4 + 'px)');
    }
  });

  // =====================
  // SCROLL ANIMATIONS
  // =====================
  function animateOnScroll() {
    var windowHeight = $(window).height();
    var scrollTop = $(window).scrollTop();

    $('.animate-on-scroll').each(function () {
      var $el = $(this);
      var elTop = $el.offset().top;
      var triggerPoint = scrollTop + windowHeight - 80;

      if (elTop < triggerPoint && !$el.hasClass('animated')) {
        $el.addClass('animated');
      }
    });
  }

  $(window).on('scroll', animateOnScroll);
  animateOnScroll(); // run once on load

  // =====================
  // COUNTER ANIMATION
  // =====================
  var countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;

    var $firstStat = $('.stat-number').first();
    if (!$firstStat.length) return;

    var elTop = $firstStat.offset().top;
    var windowBottom = $(window).scrollTop() + $(window).height();

    if (windowBottom > elTop + 50) {
      countersStarted = true;

      $('.stat-number').each(function () {
        var $counter = $(this);
        var target = parseInt($counter.data('target'));
        if (isNaN(target)) return;

        var duration = 2000;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          // Ease out cubic
          var eased = 1 - Math.pow(1 - progress, 3);
          $counter.text(Math.floor(eased * target));
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            $counter.text(target);
          }
        }

        requestAnimationFrame(step);
      });
    }
  }

  $(window).on('scroll', animateCounters);
  animateCounters();

  // =====================
  // COURSE FILTER
  // =====================
  $('.filter-btn').on('click', function () {
    var filter = $(this).data('filter');

    $('.filter-btn').removeClass('active');
    $(this).addClass('active');

    if (filter === 'all') {
      $('.course-card').removeClass('hidden').css('display', '');
      // Re-trigger animation
      $('.course-card').each(function (i) {
        var $card = $(this);
        $card.css({ opacity: 0, transform: 'translateY(30px)' });
        setTimeout(function () {
          $card.css({ opacity: 1, transform: 'translateY(0)', transition: '0.5s ease' });
        }, i * 80);
      });
    } else {
      $('.course-card').each(function (i) {
        var $card = $(this);
        if ($card.data('category') === filter) {
          $card.removeClass('hidden').css('display', '');
          $card.css({ opacity: 0, transform: 'translateY(30px)' });
          setTimeout(function () {
            $card.css({ opacity: 1, transform: 'translateY(0)', transition: '0.5s ease' });
          }, i * 80);
        } else {
          $card.css({ opacity: 0, transform: 'translateY(20px)', transition: '0.3s ease' });
          setTimeout(function () {
            $card.addClass('hidden');
          }, 300);
        }
      });
    }
  });

  // =====================
  // TESTIMONIALS SLIDER
  // =====================
  var currentSlide = 0;
  var $track = $('#testimonialTrack');
  var $slides = $track.children();
  var totalSlides = $slides.length;
  var $dotsContainer = $('#sliderDots');

  // Create dots
  for (var i = 0; i < totalSlides; i++) {
    $dotsContainer.append('<div class="slider-dot' + (i === 0 ? ' active' : '') + '" data-slide="' + i + '"></div>');
  }

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;
    $track.css('transform', 'translateX(-' + (currentSlide * 100) + '%)');
    $dotsContainer.find('.slider-dot').removeClass('active');
    $dotsContainer.find('.slider-dot').eq(currentSlide).addClass('active');
  }

  $('#nextSlide').on('click', function () {
    goToSlide(currentSlide + 1);
  });

  $('#prevSlide').on('click', function () {
    goToSlide(currentSlide - 1);
  });

  $dotsContainer.on('click', '.slider-dot', function () {
    goToSlide($(this).data('slide'));
  });

  // Auto-slide
  var autoSlide = setInterval(function () {
    goToSlide(currentSlide + 1);
  }, 5000);

  // Pause on hover
  $('.testimonials-slider').on('mouseenter', function () {
    clearInterval(autoSlide);
  }).on('mouseleave', function () {
    autoSlide = setInterval(function () {
      goToSlide(currentSlide + 1);
    }, 5000);
  });

  // Touch swipe support
  var touchStartX = 0;
  var touchEndX = 0;

  $track.on('touchstart', function (e) {
    touchStartX = e.originalEvent.changedTouches[0].screenX;
  });

  $track.on('touchend', function (e) {
    touchEndX = e.originalEvent.changedTouches[0].screenX;
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToSlide(currentSlide + 1);
      } else {
        goToSlide(currentSlide - 1);
      }
    }
  });

  // =====================
  // CONTACT FORM
  // =====================
  $('#contactForm').on('submit', function (e) {
    e.preventDefault();

    var $form = $(this);
    var $btn = $form.find('button[type="submit"]');
    var btnText = $btn.html();

    // Simple validation visual
    var valid = true;
    $form.find('[required]').each(function () {
      if (!$(this).val()) {
        $(this).css('border-color', '#ef4444');
        valid = false;
      } else {
        $(this).css('border-color', '');
      }
    });

    if (!valid) return;

    // Simulate submission
    $btn.html('<i class="fas fa-spinner fa-spin"></i> Sending...');
    $btn.prop('disabled', true);

    setTimeout(function () {
      $form.fadeOut(300, function () {
        var successHTML =
          '<div class="form-success show">' +
          '<i class="fas fa-check-circle"></i>' +
          '<h3>Salamat! Message Sent</h3>' +
          '<p>We\'ll get back to you within 24 hours. Maraming salamat!</p>' +
          '</div>';
        $form.after(successHTML);
        $form.next('.form-success').hide().fadeIn(500);
      });
    }, 1800);
  });

  // Reset input border on focus
  $('#contactForm').on('focus', 'input, select, textarea', function () {
    $(this).css('border-color', '');
  });

  // =====================
  // FLOATING ICONS PARALLAX
  // =====================
  $(window).on('mousemove', function (e) {
    var mouseX = e.pageX / $(window).width();
    var mouseY = e.pageY / $(window).height();

    $('.float-item').each(function (index) {
      var speed = (index + 1) * 8;
      var x = (mouseX - 0.5) * speed;
      var y = (mouseY - 0.5) * speed;
      $(this).css('transform', 'translate(' + x + 'px, ' + y + 'px)');
    });
  });

  // =====================
  // TILT EFFECT ON COURSE CARDS
  // =====================
  if ($(window).width() > 768) {
    $('.course-card').on('mousemove', function (e) {
      var $card = $(this);
      var rect = this.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = (y - centerY) / 20;
      var rotateY = (centerX - x) / 20;
      $card.css('transform', 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)');
    }).on('mouseleave', function () {
      $(this).css('transform', 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)');
    });
  }

  // =====================
  // TYPING EFFECT ON HERO (optional subtle touch)
  // =====================
  var $heroSubtitle = $('.hero-badge span');
  if ($heroSubtitle.length) {
    $heroSubtitle.css('opacity', 0);
    setTimeout(function () {
      $heroSubtitle.css({ opacity: 1, transition: 'opacity 1s ease' });
    }, 2000);
  }

});
