import { useEffect } from "react"

function App() {
  useEffect(() => {
    "use strict";

    (function () {
      // Global variables
      let
        userAgent = navigator.userAgent.toLowerCase(),
        isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false;

      // Unsupported browsers
      if (isIE !== false && isIE < 12) {
        console.warn("[Core] detected IE" + isIE + ", load alert");
        var script = document.createElement("script");
        script.src = "./js/support.js";
        document.querySelector("head").appendChild(script);
      }

      let
        initialDate = new Date(),

        $document = $(document),
        $window = $(window),
        $html = $("html"),
        $body = $("body"),

        isDesktop = $html.hasClass("desktop"),
        isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        windowReady = false,
        isNoviBuilder = false,
        loaderTimeoutId,

        plugins = {
          bootstrapTooltip: $("[data-bs-toggle='tooltip']"),
          bootstrapTabs: $('.tabs-custom'),
          rdNavbar: $('.rd-navbar'),
          materialParallax: $('.parallax-container'),
          rdMailForm: $('.rd-mailform'),
          rdInputLabel: $('.form-label'),
          regula: $('[data-constraints]'),
          selectFilter: $('select'),
          stepper: $("input[type='number']"),
          wow: $('.wow'),
          owl: $('.owl-carousel'),
          swiper: $('.swiper-slider'),
          slick: $('.slick-slider'),
          search: $('.rd-search'),
          searchResults: $('.rd-search-results'),
          isotope: $('.isotope-wrap'),
          radio: $("input[type='radio']"),
          checkbox: $("input[type='checkbox']"),
          customToggle: $('[data-custom-toggle]'),
          counter: $('.counter'),
          progressLinear: $('.progress-linear'),
          countdown: $('.countdown'),
          preloader: $('.preloader'),
          captcha: $('.recaptcha'),
          scroller: $('.scroll-wrap'),
          lightGallery: $("[data-lightgallery='group']"),
          lightGalleryItem: $("[data-lightgallery='item']"),
          lightDynamicGalleryItem: $("[data-lightgallery='dynamic']"),
          mailchimp: $('.mailchimp-mailform'),
          campaignMonitor: $('.campaign-mailform'),
          copyrightYear: $('.copyright-year'),
          buttonWinona: $('.button-winona'),
          rdRange: $('.rd-range'),
          radioPanel: $('.radio-panel .radio-inline'),
          hoverdir: $('.hoverdir .hoverdir-item'),
          maps: $('.google-map-container'),
          customWaypoints: $('[data-custom-scroll-to]'),
          multitoggle: document.querySelectorAll('[data-multitoggle]'),
        };


      /**
       * @desc Check the element has been scrolled into the view
       * @param {object} elem - jQuery object
       * @return {boolean}
       */
      function isScrolledIntoView(elem) {
        if (isNoviBuilder) return true;
        return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
      }

      /**
       * @desc Calls a function when element has been scrolled into the view
       * @param {object} element - jQuery object
       * @param {function} func - init function
       */
      function lazyInit(element, func) {
        var scrollHandler = function () {
          if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
            func.call(element);
            element.addClass('lazy-loaded');
          }
        };

        scrollHandler();
        $window.on('scroll', scrollHandler);
      }

      // Initialize scripts that require a loaded page
      $window.on('load', function () {

        // Page loader & Page transition
        if (plugins.preloader.length && !isNoviBuilder) {
          pageTransition({
            target: document.querySelector('.page'),
            delay: 0,
            duration: 500,
            classIn: 'fadeIn',
            classOut: 'fadeOut',
            classActive: 'animated',
            conditions: function (event, link) {
              return link && !/(\#|javascript:void\(0\)|callto:|tel:|mailto:|:\/\/)/.test(link) && !event.currentTarget.hasAttribute('data-lightgallery');
            },
            onTransitionStart: function (options) {
              setTimeout(function () {
                plugins.preloader.removeClass('loaded');
              }, options.duration * .75);
            },
            onReady: function () {
              plugins.preloader.addClass('loaded');
              windowReady = true;
            }
          });
        }

        // Isotope
        if (plugins.isotope.length) {
          for (var i = 0; i < plugins.isotope.length; i++) {
            var
              wrap = plugins.isotope[i],
              filterHandler = function (event) {
                event.preventDefault();
                for (var n = 0; n < this.isoGroup.filters.length; n++) this.isoGroup.filters[n].classList.remove('active');
                this.classList.add('active');
                this.isoGroup.isotope.arrange({ filter: this.getAttribute("data-isotope-filter") !== '*' ? '[data-filter*="' + this.getAttribute("data-isotope-filter") + '"]' : '*' });
              },
              resizeHandler = function () {
                this.isoGroup.isotope.layout();
              };

            wrap.isoGroup = {};
            wrap.isoGroup.filters = wrap.querySelectorAll('[data-isotope-filter]');
            wrap.isoGroup.node = wrap.querySelector('.isotope');
            wrap.isoGroup.layout = wrap.isoGroup.node.getAttribute('data-isotope-layout') ? wrap.isoGroup.node.getAttribute('data-isotope-layout') : 'masonry';
            wrap.isoGroup.isotope = new Isotope(wrap.isoGroup.node, {
              itemSelector: '.isotope-item',
              layoutMode: wrap.isoGroup.layout,
              filter: '*',
              columnWidth: (function () {
                if (wrap.isoGroup.node.hasAttribute('data-column-class')) return wrap.isoGroup.node.getAttribute('data-column-class');
                if (wrap.isoGroup.node.hasAttribute('data-column-width')) return parseFloat(wrap.isoGroup.node.getAttribute('data-column-width'));
              }())
            });

            for (var n = 0; n < wrap.isoGroup.filters.length; n++) {
              var filter = wrap.isoGroup.filters[n];
              filter.isoGroup = wrap.isoGroup;
              filter.addEventListener('click', filterHandler);
            }

            window.addEventListener('resize', resizeHandler.bind(wrap));
          }
        }

        // WOW
        if ($html.hasClass("wow-animation") && plugins.wow.length && !isNoviBuilder && isDesktop) {
          new WOW().init();
        }

        // Material Parallax
        if (plugins.materialParallax.length) {
          if (!isNoviBuilder && !isIE && !isMobile) {
            plugins.materialParallax.parallax();
          } else {
            for (var i = 0; i < plugins.materialParallax.length; i++) {
              var $parallax = $(plugins.materialParallax[i]);

              $parallax.addClass('parallax-disabled');
              $parallax.css({ "background-image": 'url(' + $parallax.data("parallax-img") + ')' });
            }
          }
        }

        // jQuery Count To
        if (plugins.counter.length) {
          for (var i = 0; i < plugins.counter.length; i++) {
            var
              counter = $(plugins.counter[i]),
              initCount = function () {
                var counter = $(this);
                if (!counter.hasClass("animated-first") && isScrolledIntoView(counter)) {
                  counter.countTo({
                    refreshInterval: 40,
                    speed: counter.attr("data-speed") || 1000,
                    from: 0,
                    to: parseInt(counter.text(), 10)
                  });
                  counter.addClass('animated-first');
                }
              };

            $.proxy(initCount, counter)();
            $window.on("scroll", $.proxy(initCount, counter));
          }
        }

        // Linear Progress bar
        if (plugins.progressLinear.length) {
          for (i = 0; i < plugins.progressLinear.length; i++) {
            var
              progressBar = $(plugins.progressLinear[i]),
              runProgress = function () {
                var bar = $(this);
                var end = parseInt($(this).find('.progress-value').text(), 10);
                bar.find('.progress-bar-linear').css({ width: end + '%' });
                bar.find('.progress-value').countTo({
                  refreshInterval: 40,
                  from: 0,
                  to: end,
                  speed: 500
                });
                bar.addClass('animated-first');
              },
              scrollHandler = function () {
                var bar = $(this);
                if (!bar.hasClass('animated-first') && isScrolledIntoView(bar)) {
                  runProgress.call(bar);
                }
              };

            setTimeout((function () {
              scrollHandler.call(this);
              window.addEventListener('scroll', scrollHandler.bind(this));
            }).bind(progressBar), 500);
          }
        }
      });


      // Initialize scripts that require a finished document
      $(function () {
        isNoviBuilder = window.xMode;

        /**
         * Wrapper to eliminate json errors
         * @param {string} str - JSON string
         * @returns {object} - parsed or empty object
         */
        function parseJSON(str) {
          try {
            if (str) return JSON.parse(str);
            else return {};
          } catch (error) {
            console.warn(error);
            return {};
          }
        }

        /**
         * @desc Toggle swiper videos on active slides
         * @param {object} swiper - swiper slider
         */
        function toggleSwiperInnerVideos(swiper) {
          var prevSlide = $(swiper.slides[swiper.previousIndex]),
            nextSlide = $(swiper.slides[swiper.activeIndex]),
            videos,
            videoItems = prevSlide.find("video");

          for (var i = 0; i < videoItems.length; i++) {
            videoItems[i].pause();
          }

          videos = nextSlide.find("video");
          if (videos.length) {
            videos.get(0).play();
          }
        }

        /**
         * @desc Sets slides background images from attribute 'data-slide-bg'
         * @param {object} swiper - swiper instance
         */
        function setBackgrounds(swiper) {
          let swipersBg = swiper.el.querySelectorAll('[data-slide-bg]');

          for (let i = 0; i < swipersBg.length; i++) {
            let swiperBg = swipersBg[i];
            swiperBg.style.backgroundImage = 'url(' + swiperBg.getAttribute('data-slide-bg') + ')';
          }
        }

        /**
         * toggleSwiperCaptionAnimation
         * @description  toggle swiper animations on active slides
         */
        function toggleSwiperCaptionAnimation(swiper) {
          let prevSlide = $(swiper.$el[0]),
            nextSlide = $(swiper.slides[swiper.activeIndex]);

          prevSlide
            .find("[data-caption-animate]")
            .each(function () {
              let $this = $(this);
              $this
                .removeClass("animated")
                .removeClass($this.attr("data-caption-animate"))
                .addClass("not-animated");
            });

          nextSlide
            .find("[data-caption-animate]")
            .each(function () {
              let $this = $(this),
                delay = $this.attr("data-caption-delay");


              if (!isNoviBuilder) {
                setTimeout(function () {
                  $this
                    .removeClass("not-animated")
                    .addClass($this.attr("data-caption-animate"))
                    .addClass("animated");
                }, delay ? parseInt(delay) : 0);
              } else {
                $this
                  .removeClass("not-animated")
              }
            });
        }

        /**
         * @desc Set slides preview for navigation button
         * @param {object} swiper - swiper slider
         */
        function setSwiperNavPreview(swiper) {
          var activeSlideIndex, slidesCount;

          activeSlideIndex = swiper.activeIndex;

          slidesCount = swiper.slides.filter(function (el) { return !el.classList.contains('swiper-slide-duplicate') }).length;

          if (activeSlideIndex === slidesCount + 1) {
            activeSlideIndex = 1;
          } else if (activeSlideIndex === 0) {
            activeSlideIndex = slidesCount;
          }
          // Replace btn img
          if (swiper.$el.find('.preview__img')[0] !== undefined) {

            swiper.$el.find('.swiper-button-prev .preview__img').css("background-image", "url(" + swiper.slides[activeSlideIndex - 1].getAttribute("data-slide-bg") + ")");
            swiper.$el.find('.swiper-button-next .preview__img').css("background-image", "url(" + swiper.slides[activeSlideIndex + 1].getAttribute("data-slide-bg") + ")");
          }
        }

        /**
         * @desc Initialize owl carousel plugin
         * @param {object} c - carousel jQuery object
         */
        function initOwlCarousel(c) {
          var aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"],
            values = [0, 576, 768, 992, 1200, 1600],
            responsive = {};

          for (var j = 0; j < values.length; j++) {
            responsive[values[j]] = {};
            for (var k = j; k >= -1; k--) {
              if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
                responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
              }
              if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
                responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
              }
              if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
                responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
              }
            }
          }

          // Enable custom pagination
          if (c.attr('data-dots-custom')) {
            c.on("initialized.owl.carousel", function (event) {
              var carousel = $(event.currentTarget),
                customPag = $(carousel.attr("data-dots-custom")),
                active = 0;

              if (carousel.attr('data-active')) {
                active = parseInt(carousel.attr('data-active'), 10);
              }

              carousel.trigger('to.owl.carousel', [active, 300, true]);
              customPag.find("[data-owl-item='" + active + "']").addClass("active");

              customPag.find("[data-owl-item]").on('click', function (e) {
                e.preventDefault();
                carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item"), 10), 300, true]);
              });

              carousel.on("translate.owl.carousel", function (event) {
                customPag.find(".active").removeClass("active");
                customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
              });
            });
          }

          c.on("initialized.owl.carousel", function () {
            initLightGalleryItem(c.find('[data-lightgallery="item"]'), 'lightGallery-in-carousel');
          });

          // Create custom Numbering
          if (typeof (c.attr("data-numbering")) !== 'undefined') {
            var numberingObject = $(c.attr("data-numbering"));

            c.on('initialized.owl.carousel changed.owl.carousel', function (numberingObject) {
              return function (e) {
                if (!e.namespace) return;
                if (isNoviBuilder ? false : c.attr("data-loop") !== "false") {
                  var tempFix = (e.item.index + 1) - (e.relatedTarget.clones().length / 2);
                  if (tempFix > 0) {
                    numberingObject.find('.numbering-current').text(tempFix > e.item.count ? tempFix % e.item.count : tempFix);
                  } else {
                    numberingObject.find('.numbering-current').text(e.item.index + 1);
                  }
                } else {
                  numberingObject.find('.numbering-current').text(e.item.index + 1);
                }

                numberingObject.find('.numbering-count').text(e.item.count);
              };
            }(numberingObject));
          }

          c.owlCarousel({
            autoplay: isNoviBuilder ? false : c.attr("data-autoplay") === "true",
            loop: isNoviBuilder ? false : c.attr("data-loop") !== "false",
            items: 1,
            merge: true,
            center: c.attr("data-center") === "true",
            dotsContainer: c.attr("data-pagination-class") || false,
            navContainer: c.attr("data-navigation-class") || false,
            mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
            nav: c.attr("data-nav") === "true",
            dots: c.attr("data-dots") === "true",
            dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each"), 10) : false,
            animateIn: c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
            animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
            responsive: responsive,
            smartSpeed: c.attr('data-smart-speed') ? c.attr('data-smart-speed') : 250,
            navText: function () {
              try {
                return JSON.parse(c.attr("data-nav-text"));
              } catch (e) {
                return [];
              }
            }(),
            navClass: function () {
              try {
                return JSON.parse(c.attr("data-nav-class"));
              } catch (e) {
                return ['owl-prev', 'owl-next'];
              }
            }()
          });
        }

        /**
         * @desc Create live search results
         * @param {object} options
         */
        function liveSearch(options) {
          $('#' + options.live).removeClass('cleared').html();
          options.current++;
          options.spin.addClass('loading');
          $.get(handler, {
            s: decodeURI(options.term),
            liveSearch: options.live,
            dataType: "html",
            liveCount: options.liveCount,
            filter: options.filter,
            template: options.template
          }, function (data) {
            options.processed++;
            var live = $('#' + options.live);
            if ((options.processed === options.current) && !live.hasClass('cleared')) {
              live.find('> #search-results').removeClass('active');
              live.html(data);
              setTimeout(function () {
                live.find('> #search-results').addClass('active');
              }, 50);
            }
            options.spin.parents('.rd-search').find('.input-group-addon').removeClass('loading');
          })
        }

        /**
         * @desc Attach form validation to elements
         * @param {object} elements - jQuery object
         */
        function attachFormValidator(elements) {
          // Custom validator - phone number
          regula.custom({
            name: 'PhoneNumber',
            defaultMessage: 'Invalid phone number format',
            validator: function () {
              if (this.value === '') return true;
              else return /^(\+\d)?[0-9\-\(\) ]{5,}$/i.test(this.value);
            }
          });

          for (let i = 0; i < elements.length; i++) {
            let o = $(elements[i]), v;
            o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
            v = o.parent().find(".form-validation");
            if (v.is(":last-child")) o.addClass("form-control-last-child");
          }

          elements.on('input change propertychange blur', function (e) {
            let $this = $(this), results;

            if (e.type !== "blur") if (!$this.parent().hasClass("has-error")) return;
            if ($this.parents('.rd-mailform').hasClass('success')) return;

            if ((results = $this.regula('validate')).length) {
              for (let i = 0; i < results.length; i++) {
                $this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error");
              }
            } else {
              $this.siblings(".form-validation").text("").parent().removeClass("has-error")
            }
          }).regula('bind');

          let regularConstraintsMessages = [
            {
              type: regula.Constraint.Required,
              newMessage: "The text field is required."
            },
            {
              type: regula.Constraint.Email,
              newMessage: "The email is not a valid email."
            },
            {
              type: regula.Constraint.Numeric,
              newMessage: "Only numbers are required"
            },
            {
              type: regula.Constraint.Selected,
              newMessage: "Please choose an option."
            }
          ];


          for (let i = 0; i < regularConstraintsMessages.length; i++) {
            let regularConstraint = regularConstraintsMessages[i];

            regula.override({
              constraintType: regularConstraint.type,
              defaultMessage: regularConstraint.newMessage
            });
          }
        }

        /**
         * @desc Check if all elements pass validation
         * @param {object} elements - object of items for validation
         * @param {object} captcha - captcha object for validation
         * @return {boolean}
         */
        function isValidated(elements, captcha) {
          let results, errors = 0;

          if (elements.length) {
            for (let j = 0; j < elements.length; j++) {

              let $input = $(elements[j]);
              if ((results = $input.regula('validate')).length) {
                for (let k = 0; k < results.length; k++) {
                  errors++;
                  $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
                }
              } else {
                $input.siblings(".form-validation").text("").parent().removeClass("has-error")
              }
            }

            if (captcha) {
              if (captcha.length) {
                return validateReCaptcha(captcha) && errors === 0
              }
            }

            return errors === 0;
          }
          return true;
        }

        /**
         * @desc Validate google reCaptcha
         * @param {object} captcha - captcha object for validation
         * @return {boolean}
         */
        function validateReCaptcha(captcha) {
          let captchaToken = captcha.find('.g-recaptcha-response').val();

          if (captchaToken.length === 0) {
            captcha
              .siblings('.form-validation')
              .html('Please, prove that you are not robot.')
              .addClass('active');
            captcha
              .closest('.form-wrap')
              .addClass('has-error');

            captcha.on('propertychange', function () {
              let $this = $(this),
                captchaToken = $this.find('.g-recaptcha-response').val();

              if (captchaToken.length > 0) {
                $this
                  .closest('.form-wrap')
                  .removeClass('has-error');
                $this
                  .siblings('.form-validation')
                  .removeClass('active')
                  .html('');
                $this.off('propertychange');
              }
            });
            return false;
          }
          return true;
        }

        /**
         * @desc Initialize Google reCaptcha
         */
        window.onloadCaptchaCallback = function () {
          for (let i = 0; i < plugins.captcha.length; i++) {
            let
              $captcha = $(plugins.captcha[i]),
              resizeHandler = (function () {
                let
                  frame = this.querySelector('iframe'),
                  inner = this.firstElementChild,
                  inner2 = inner.firstElementChild,
                  containerRect = null,
                  frameRect = null,
                  scale = null;

                inner2.style.transform = '';
                inner.style.height = 'auto';
                inner.style.width = 'auto';

                containerRect = this.getBoundingClientRect();
                frameRect = frame.getBoundingClientRect();
                scale = containerRect.width / frameRect.width;

                if (scale < 1) {
                  inner2.style.transform = 'scale(' + scale + ')';
                  inner.style.height = (frameRect.height * scale) + 'px';
                  inner.style.width = (frameRect.width * scale) + 'px';
                }
              }).bind(plugins.captcha[i]);

            grecaptcha.render(
              $captcha.attr('id'),
              {
                sitekey: $captcha.attr('data-sitekey'),
                size: $captcha.attr('data-size') ? $captcha.attr('data-size') : 'normal',
                theme: $captcha.attr('data-theme') ? $captcha.attr('data-theme') : 'light',
                callback: function () {
                  $('.recaptcha').trigger('propertychange');
                }
              }
            );

            $captcha.after("<span class='form-validation'></span>");

            if (plugins.captcha[i].hasAttribute('data-auto-size')) {
              resizeHandler();
              window.addEventListener('resize', resizeHandler);
            }
          }
        };

        /**
         * @desc Initialize Bootstrap tooltip with required placement
         * @param {string} tooltipPlacement
         */
        function initBootstrapTooltip(tooltipPlacement) {
          plugins.bootstrapTooltip.tooltip('dispose');

          if (window.innerWidth < 576) {
            plugins.bootstrapTooltip.tooltip({ placement: 'bottom' });
          } else {
            plugins.bootstrapTooltip.tooltip({ placement: tooltipPlacement });
          }
        }

        /**
         * @desc Initialize the gallery with set of images
         * @param {object} itemsToInit - jQuery object
         * @param {string} [addClass] - additional gallery class
         */
        function initLightGallery(itemsToInit, addClass) {
          if (!isNoviBuilder) {
            $(itemsToInit).lightGallery({
              thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
              selector: "[data-lightgallery='item']",
              autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
              pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
              addClass: addClass,
              mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
              loop: $(itemsToInit).attr("data-lg-loop") !== "false"
            });
          }
        }

        /**
         * @desc Initialize the gallery with dynamic addition of images
         * @param {object} itemsToInit - jQuery object
         * @param {string} [addClass] - additional gallery class
         */
        function initDynamicLightGallery(itemsToInit, addClass) {
          if (!isNoviBuilder) {
            $(itemsToInit).on("click", function () {
              $(itemsToInit).lightGallery({
                thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
                selector: "[data-lightgallery='item']",
                autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
                pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
                addClass: addClass,
                mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
                loop: $(itemsToInit).attr("data-lg-loop") !== "false",
                dynamic: true,
                dynamicEl: JSON.parse($(itemsToInit).attr("data-lg-dynamic-elements")) || []
              });
            });
          }
        }

        /**
         * @desc Initialize the gallery with one image
         * @param {object} itemToInit - jQuery object
         * @param {string} [addClass] - additional gallery class
         */
        function initLightGalleryItem(itemToInit, addClass) {
          if (!isNoviBuilder) {
            $(itemToInit).lightGallery({
              selector: "this",
              addClass: addClass,
              counter: false,
              youtubePlayerParams: {
                modestbranding: 1,
                showinfo: 0,
                rel: 0,
                controls: 0
              },
              vimeoPlayerParams: {
                byline: 0,
                portrait: 0
              }
            });
          }
        }

        /**
         * @desc Google map function for getting latitude and longitude
         */
        function getLatLngObject(str, marker, map, callback) {
          var coordinates = {};
          try {
            coordinates = JSON.parse(str);
            callback(new google.maps.LatLng(
              coordinates.lat,
              coordinates.lng
            ), marker, map)
          } catch (e) {
            map.geocoder.geocode({ 'address': str }, function (results, status) {
              if (status === google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();

                callback(new google.maps.LatLng(
                  parseFloat(latitude),
                  parseFloat(longitude)
                ), marker, map)
              }
            })
          }
        }

        /**
         * @desc Initialize Google maps
         */
        function initMaps() {
          var key;

          for (var i = 0; i < plugins.maps.length; i++) {
            if (plugins.maps[i].hasAttribute("data-key")) {
              key = plugins.maps[i].getAttribute("data-key");
              break;
            }
          }

          $.getScript('//maps.google.com/maps/api/js?' + (key ? 'key=' + key + '&' : '') + 'sensor=false&libraries=geometry,places&v=quarterly', function () {
            var geocoder = new google.maps.Geocoder;
            for (var i = 0; i < plugins.maps.length; i++) {
              var zoom = parseInt(plugins.maps[i].getAttribute("data-zoom"), 10) || 11;
              var styles = plugins.maps[i].hasAttribute('data-styles') ? JSON.parse(plugins.maps[i].getAttribute("data-styles")) : [];
              var center = plugins.maps[i].getAttribute("data-center") || "New York";

              // Initialize map
              var map = new google.maps.Map(plugins.maps[i].querySelectorAll(".google-map")[0], {
                zoom: zoom,
                styles: styles,
                scrollwheel: false,
                center: { lat: 0, lng: 0 }
              });

              // Add map object to map node
              plugins.maps[i].map = map;
              plugins.maps[i].geocoder = geocoder;
              plugins.maps[i].keySupported = true;
              plugins.maps[i].google = google;

              // Get Center coordinates from attribute
              getLatLngObject(center, null, plugins.maps[i], function (location, markerElement, mapElement) {
                mapElement.map.setCenter(location);
              });

              // Add markers from google-map-markers array
              var markerItems = plugins.maps[i].querySelectorAll(".google-map-markers li");

              if (markerItems.length) {
                var markers = [];
                for (var j = 0; j < markerItems.length; j++) {
                  var markerElement = markerItems[j];
                  getLatLngObject(markerElement.getAttribute("data-location"), markerElement, plugins.maps[i], function (location, markerElement, mapElement) {
                    var icon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
                    var activeIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active");
                    var info = markerElement.getAttribute("data-description") || "";
                    var infoWindow = new google.maps.InfoWindow({
                      content: info
                    });
                    markerElement.infoWindow = infoWindow;
                    var markerData = {
                      position: location,
                      map: mapElement.map
                    }
                    if (icon) {
                      markerData.icon = icon;
                    }
                    var marker = new google.maps.Marker(markerData);
                    markerElement.gmarker = marker;
                    markers.push({ markerElement: markerElement, infoWindow: infoWindow });
                    marker.isActive = false;
                    // Handle infoWindow close click
                    google.maps.event.addListener(infoWindow, 'closeclick', (function (markerElement, mapElement) {
                      var markerIcon = null;
                      markerElement.gmarker.isActive = false;
                      markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
                      markerElement.gmarker.setIcon(markerIcon);
                    }).bind(this, markerElement, mapElement));


                    // Set marker active on Click and open infoWindow
                    google.maps.event.addListener(marker, 'click', (function (markerElement, mapElement) {
                      if (markerElement.infoWindow.getContent().length === 0) return;
                      var gMarker, currentMarker = markerElement.gmarker, currentInfoWindow;
                      for (var k = 0; k < markers.length; k++) {
                        var markerIcon;
                        if (markers[k].markerElement === markerElement) {
                          currentInfoWindow = markers[k].infoWindow;
                        }
                        gMarker = markers[k].markerElement.gmarker;
                        if (gMarker.isActive && markers[k].markerElement !== markerElement) {
                          gMarker.isActive = false;
                          markerIcon = markers[k].markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")
                          gMarker.setIcon(markerIcon);
                          markers[k].infoWindow.close();
                        }
                      }

                      currentMarker.isActive = !currentMarker.isActive;
                      if (currentMarker.isActive) {
                        if (markerIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active")) {
                          currentMarker.setIcon(markerIcon);
                        }

                        currentInfoWindow.open(map, marker);
                      } else {
                        if (markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")) {
                          currentMarker.setIcon(markerIcon);
                        }
                        currentInfoWindow.close();
                      }
                    }).bind(this, markerElement, mapElement))
                  })
                }
              }
            }
          });
        }

        /**
         * @desc Initialize the direction-aware hover
         * @param {object} elements - jQuery object
         */
        function initHoverDir(elements) {
          if (!isNoviBuilder && isDesktop) {
            for (var z = 0; z < elements.length; z++) {
              var $element = $(elements[z]);

              $element.hoverdir({
                hoverElem: $element.attr('data-hoverdir-target') ? $element.attr('data-hoverdir-target') : 'div'
              }
              );
            }
          }
        }

        // Google ReCaptcha
        if (plugins.captcha.length) {
          $.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
        }

        // Additional class on html if mac os.
        if (navigator.platform.match(/(Mac)/i)) {
          $html.addClass("mac-os");
        }

        // Adds some loosing functionality to IE browsers (IE Polyfills)
        if (isIE) {
          if (isIE === 12) $html.addClass("ie-edge");
          if (isIE === 11) $html.addClass("ie-11");
          if (isIE < 10) $html.addClass("lt-ie-10");
          if (isIE < 11) $html.addClass("ie-10");
        }

        // Bootstrap Tooltips
        if (plugins.bootstrapTooltip.length) {
          var tooltipPlacement = plugins.bootstrapTooltip.attr('data-bs-placement');
          initBootstrapTooltip(tooltipPlacement);

          $window.on('resize orientationchange', function () {
            initBootstrapTooltip(tooltipPlacement);
          })
        }

        // Bootstrap tabs
        if (plugins.bootstrapTabs.length) {
          for (var i = 0; i < plugins.bootstrapTabs.length; i++) {
            var bootstrapTabsItem = $(plugins.bootstrapTabs[i]);

            //If have slick carousel inside tab - resize slick carousel on click
            if (bootstrapTabsItem.find('.slick-slider').length) {
              bootstrapTabsItem.find('.tabs-custom-list > li > a').on('click', $.proxy(function () {
                var $this = $(this);
                var setTimeOutTime = isNoviBuilder ? 1500 : 300;

                setTimeout(function () {
                  $this.find('.tab-content .tab-pane.active .slick-slider').slick('setPosition');
                }, setTimeOutTime);
              }, bootstrapTabsItem));
            }

            if (bootstrapTabsItem.attr('data-view-triggerable') === 'true') {
              (function (bootstrapTabsItem) {
                bootstrapTabsItem.on('shown.bs.tab', function (event) {
                  var prevTriggerable = bootstrapTabsItem.find('[data-view-trigger="' + event.relatedTarget.getAttribute('href') + '"]'),
                    triggerable = bootstrapTabsItem.find('[data-view-trigger="' + event.target.getAttribute('href') + '"]');

                  prevTriggerable.removeClass('active');
                  triggerable.addClass('active');
                });

              })(bootstrapTabsItem);
            }
          }
        }

        // Copyright Year (Evaluates correct copyright year)
        if (plugins.copyrightYear.length) {
          plugins.copyrightYear.text(initialDate.getFullYear());
        }

        // Google maps
        if (plugins.maps.length) {
          lazyInit(plugins.maps, initMaps);
        }

        // Add custom styling options for input[type="radio"]
        if (plugins.radio.length) {
          for (let i = 0; i < plugins.radio.length; i++) {
            $(plugins.radio[i]).addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
          }
        }

        // Add custom styling options for input[type="checkbox"]
        if (plugins.checkbox.length) {
          for (let i = 0; i < plugins.checkbox.length; i++) {
            $(plugins.checkbox[i]).addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
          }
        }

        // UI To Top
        if (isDesktop && !isNoviBuilder) {
          $().UItoTop({
            easingType: 'easeOutQuad',
            containerClass: 'ui-to-top mdi mdi-arrow-up'
          });
        }

        // RD Navbar
        if (plugins.rdNavbar.length) {
          var aliaces, i, j, len, value, values, responsiveNavbar;

          aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"];
          values = [0, 576, 768, 992, 1200, 1600];
          responsiveNavbar = {};

          for (i = j = 0, len = values.length; j < len; i = ++j) {
            value = values[i];
            if (!responsiveNavbar[values[i]]) {
              responsiveNavbar[values[i]] = {};
            }
            if (plugins.rdNavbar.attr('data' + aliaces[i] + 'layout')) {
              responsiveNavbar[values[i]].layout = plugins.rdNavbar.attr('data' + aliaces[i] + 'layout');
            }
            if (plugins.rdNavbar.attr('data' + aliaces[i] + 'device-layout')) {
              responsiveNavbar[values[i]]['deviceLayout'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'device-layout');
            }
            if (plugins.rdNavbar.attr('data' + aliaces[i] + 'hover-on')) {
              responsiveNavbar[values[i]]['focusOnHover'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'hover-on') === 'true';
            }
            if (plugins.rdNavbar.attr('data' + aliaces[i] + 'auto-height')) {
              responsiveNavbar[values[i]]['autoHeight'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'auto-height') === 'true';
            }

            if (isNoviBuilder) {
              responsiveNavbar[values[i]]['stickUp'] = false;
            } else if (plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up')) {
              responsiveNavbar[values[i]]['stickUp'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up') === 'true';
            }

            if (plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset')) {
              responsiveNavbar[values[i]]['stickUpOffset'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset');
            }
          }


          plugins.rdNavbar.RDNavbar({
            anchorNav: !isNoviBuilder,
            stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
            responsive: responsiveNavbar,
            callbacks: {
              onStuck: function () {
                var navbarSearch = this.$element.find('.rd-search input');

                if (navbarSearch) {
                  navbarSearch.val('').trigger('propertychange');
                }
              },
              onDropdownOver: function () {
                return !isNoviBuilder;
              },
              onUnstuck: function () {
                if (this.$clone === null)
                  return;

                var navbarSearch = this.$clone.find('.rd-search input');

                if (navbarSearch) {
                  navbarSearch.val('').trigger('propertychange');
                  navbarSearch.trigger('blur');
                }

              }
            }
          });


          if (plugins.rdNavbar.attr("data-body-class")) {
            document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
          }
        }

        // RD Search
        if (plugins.search.length || plugins.searchResults) {
          var handler = "bat/rd-search.php";
          var defaultTemplate = '<h5 class="search-title"><a target="_top" href="#{href}" class="search-link">#{title}</a></h5>' +
            '<p>...#{token}...</p>' +
            '<p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>';
          var defaultFilter = '*.html';

          if (plugins.search.length) {
            for (var i = 0; i < plugins.search.length; i++) {
              var searchItem = $(plugins.search[i]),
                options = {
                  element: searchItem,
                  filter: (searchItem.attr('data-search-filter')) ? searchItem.attr('data-search-filter') : defaultFilter,
                  template: (searchItem.attr('data-search-template')) ? searchItem.attr('data-search-template') : defaultTemplate,
                  live: (searchItem.attr('data-search-live')) ? searchItem.attr('data-search-live') : false,
                  liveCount: (searchItem.attr('data-search-live-count')) ? parseInt(searchItem.attr('data-search-live'), 10) : 4,
                  current: 0, processed: 0, timer: {}
                };

              var $toggle = $('.rd-navbar-search-toggle');
              if ($toggle.length) {
                $toggle.on('click', (function (searchItem) {
                  return function () {
                    if (!($(this).hasClass('active'))) {
                      searchItem.find('input').val('').trigger('propertychange');
                    }
                  }
                })(searchItem));
              }

              if (options.live) {
                var clearHandler = false;

                searchItem.find('input').on("input propertychange", $.proxy(function () {
                  this.term = this.element.find('input').val().trim();
                  this.spin = this.element.find('.input-group-addon');

                  clearTimeout(this.timer);

                  if (this.term.length > 2) {
                    this.timer = setTimeout(liveSearch(this), 200);

                    if (clearHandler === false) {
                      clearHandler = true;

                      $body.on("click", function (e) {
                        if ($(e.toElement).parents('.rd-search').length === 0) {
                          $('#rd-search-results-live').addClass('cleared').html('');
                        }
                      })
                    }

                  } else if (this.term.length === 0) {
                    $('#' + this.live).addClass('cleared').html('');
                  }
                }, options, this));
              }

              searchItem.submit($.proxy(function () {
                $('<input />').attr('type', 'hidden')
                  .attr('name', "filter")
                  .attr('value', this.filter)
                  .appendTo(this.element);
                return true;
              }, options, this))
            }
          }

          if (plugins.searchResults.length) {
            var regExp = /\?.*s=([^&]+)\&filter=([^&]+)/g;
            var match = regExp.exec(location.search);

            if (match !== null) {
              $.get(handler, {
                s: decodeURI(match[1]),
                dataType: "html",
                filter: match[2],
                template: defaultTemplate,
                live: ''
              }, function (data) {
                plugins.searchResults.html(data);
              })
            }
          }
        }

        // Swiper
        if (plugins.swiper.length) {
          for (let i = 0; i < plugins.swiper.length; i++) {
            let
              node = plugins.swiper[i],
              customContainer = node.closest('.swiper-custom-container'),
              pagination = customContainer ? customContainer.querySelector('.swiper-pagination') : node.querySelector('.swiper-pagination'),
              params = parseJSON(node.getAttribute('data-swiper')),
              defaults = {
                speed: 1000,
                loop: node.getAttribute('data-loop') !== 'false',
                effect: node.hasAttribute('data-slide-effect') ? node.getAttribute('data-slide-effect') : 'slide',
                pagination: {
                  el: '.swiper-pagination',
                  clickable: true
                },
                navigation: {
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev'
                },
                autoplay: {
                  enabled: node.getAttribute('data-autoplay') !== 'false',
                  delay: !isNaN(Number(node.getAttribute('data-autoplay'))) ? node.getAttribute('data-autoplay') : 5000,
                },
                simulateTouch: node.getAttribute('data-simulate-touch') !== 'false',
              },
              xMode = {
                autoplay: false,
                loop: false,
                simulateTouch: false
              };

            if (pagination && pagination.getAttribute('data-bullet-custom')) {
              defaults.pagination.renderBullet = function (index, className) {
                return '<span class="' + className + '">' +
                  '  <svg width="100%" height="100%" viewbox="0 0 24 24">' +
                  '    <circle class="swiper-bullet-line" cx="12" cy="12" r="10"></circle>' +
                  '    <circle class="swiper-bullet-line-2" cx="12" cy="12" r="10"></circle>' +
                  '  </svg>' +
                  '</span>';
              }
            }

            params.on = {
              init: function () {
                setBackgrounds(this);
                toggleSwiperCaptionAnimation(this);

                var $swiper = $(node);

                var swiperCustomIndex = $swiper.find('.swiper-pagination__fraction-index').get(0),
                  swiperCustomCount = $swiper.find('.swiper-pagination__fraction-count').get(0);

                if (swiperCustomIndex && swiperCustomCount) {
                  swiperCustomIndex.innerHTML = formatIndex(this.realIndex + 1);
                  if (swiperCustomCount) {
                    swiperCustomCount.innerHTML = formatIndex($(this.slides).not(".swiper-slide-duplicate").length);
                  }
                }

                // Real Previous Index must be set recent
                this.on('slideChangeTransitionEnd', function () {
                  toggleSwiperCaptionAnimation(this);
                });
              },
              slideChangeTransitionStart: function () {
                setSwiperNavPreview(this);

                var swiperCustomIndex = $(node).find('.swiper-pagination__fraction-index').get(0);
                var activeSlideIndex, slidesCount;

                if (swiperCustomIndex) {
                  swiperCustomIndex.innerHTML = formatIndex(this.realIndex + 1);
                }

                activeSlideIndex = this.activeIndex;
                slidesCount = $(this.slides).not(".swiper-slide-duplicate").length;

                if (activeSlideIndex === slidesCount + 1) {
                  activeSlideIndex = 1;
                } else if (activeSlideIndex === 0) {
                  activeSlideIndex = slidesCount;
                }
                if ($(this.slides)[activeSlideIndex - 1].getAttribute("data-slide-title")) {
                  $(this.container).find('.swiper-button-next .title')[0].innerHTML = $(this.slides)[activeSlideIndex +
                    1].getAttribute("data-slide-title");
                  $(this.container).find('.swiper-button-prev .title')[0].innerHTML = $(this.slides)[activeSlideIndex -
                    1].getAttribute("data-slide-title");
                }

                if ($(this.slides)[activeSlideIndex - 1].getAttribute("data-slide-subtitle")) {
                  $(this.container).find('.swiper-button-prev .subtitle')[0].innerHTML = $(this.slides)[activeSlideIndex -
                    1].getAttribute("data-slide-subtitle");
                  $(this.container).find('.swiper-button-next .subtitle')[0].innerHTML = $(this.slides)[activeSlideIndex +
                    1].getAttribute("data-slide-subtitle");
                }
              }
            };
            new Swiper(node, Util.merge(isNoviBuilder ? [defaults, params, xMode] : [defaults, params]));
          }
        }

        function formatIndex(index) {
          return index < 10 ? '0' + index : index;
        }

        // Owl carousel
        if (plugins.owl.length) {
          for (var i = 0; i < plugins.owl.length; i++) {
            var c = $(plugins.owl[i]);
            plugins.owl[i].owl = c;

            initOwlCarousel(c);
          }
        }

        // RD Input Label
        if (plugins.rdInputLabel.length) {
          plugins.rdInputLabel.RDInputLabel();
        }

        // Regula
        if (plugins.regula.length) {
          attachFormValidator(plugins.regula);
        }

        // MailChimp Ajax subscription
        if (plugins.mailchimp.length) {
          for (let i = 0; i < plugins.mailchimp.length; i++) {
            let $mailchimpItem = $(plugins.mailchimp[i]),
              $email = $mailchimpItem.find('input[type="email"]');

            // Required by MailChimp
            $mailchimpItem.attr('novalidate', 'true');
            $email.attr('name', 'EMAIL');

            $mailchimpItem.on('submit', $.proxy(function ($email, event) {
              event.preventDefault();

              let $this = this;

              let data = {},
                url = $this.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
                dataArray = $this.serializeArray(),
                $output = $("#" + $this.attr("data-form-output"));

              for (i = 0; i < dataArray.length; i++) {
                data[dataArray[i].name] = dataArray[i].value;
              }

              $.ajax({
                data: data,
                url: url,
                dataType: 'jsonp',
                error: function (resp, text) {
                  $output.html('Server error: ' + text);

                  setTimeout(function () {
                    $output.removeClass("active");
                  }, 4000);
                },
                success: function (resp) {
                  $output.html(resp.msg).addClass('active');
                  $email[0].value = '';
                  let $label = $('[for="' + $email.attr('id') + '"]');
                  if ($label.length) $label.removeClass('focus not-empty');

                  setTimeout(function () {
                    $output.removeClass("active");
                  }, 6000);
                },
                beforeSend: function (data) {
                  let isNoviBuilder = window.xMode;

                  let isValidated = (function () {
                    let results, errors = 0;
                    let elements = $this.find('[data-constraints]');
                    let captcha = null;
                    if (elements.length) {
                      for (let j = 0; j < elements.length; j++) {

                        let $input = $(elements[j]);
                        if ((results = $input.regula('validate')).length) {
                          for (let k = 0; k < results.length; k++) {
                            errors++;
                            $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
                          }
                        } else {
                          $input.siblings(".form-validation").text("").parent().removeClass("has-error")
                        }
                      }

                      if (captcha) {
                        if (captcha.length) {
                          return validateReCaptcha(captcha) && errors === 0
                        }
                      }

                      return errors === 0;
                    }
                    return true;
                  })();

                  // Stop request if builder or inputs are invalide
                  if (isNoviBuilder || !isValidated)
                    return false;

                  $output.html('Submitting...').addClass('active');
                }
              });

              return false;
            }, $mailchimpItem, $email));
          }
        }

        // Campaign Monitor ajax subscription
        if (plugins.campaignMonitor.length) {
          for (let i = 0; i < plugins.campaignMonitor.length; i++) {
            let $campaignItem = $(plugins.campaignMonitor[i]);

            $campaignItem.on('submit', $.proxy(function (e) {
              let data = {},
                url = this.attr('action'),
                dataArray = this.serializeArray(),
                $output = $("#" + plugins.campaignMonitor.attr("data-form-output")),
                $this = $(this);

              for (i = 0; i < dataArray.length; i++) {
                data[dataArray[i].name] = dataArray[i].value;
              }

              $.ajax({
                data: data,
                url: url,
                dataType: 'jsonp',
                error: function (resp, text) {
                  $output.html('Server error: ' + text);

                  setTimeout(function () {
                    $output.removeClass("active");
                  }, 4000);
                },
                success: function (resp) {
                  $output.html(resp.Message).addClass('active');

                  setTimeout(function () {
                    $output.removeClass("active");
                  }, 6000);
                },
                beforeSend: function (data) {
                  // Stop request if builder or inputs are invalide
                  if (isNoviBuilder || !isValidated($this.find('[data-constraints]')))
                    return false;

                  $output.html('Submitting...').addClass('active');
                }
              });

              // Clear inputs after submit
              let inputs = $this[0].getElementsByTagName('input');
              for (let i = 0; i < inputs.length; i++) {
                inputs[i].value = '';
                let label = document.querySelector('[for="' + inputs[i].getAttribute('id') + '"]');
                if (label) label.classList.remove('focus', 'not-empty');
              }

              return false;
            }, $campaignItem));
          }
        }

        // RD Mailform
        if (plugins.rdMailForm.length) {
          let i, j, k,
            msg = {
              'MF000': 'Successfully sent!',
              'MF001': 'Recipients are not set!',
              'MF002': 'Form will not work locally!',
              'MF003': 'Please, define email field in your form!',
              'MF004': 'Please, define type of your form!',
              'MF254': 'Something went wrong with PHPMailer!',
              'MF255': 'Aw, snap! Something went wrong.'
            };

          for (i = 0; i < plugins.rdMailForm.length; i++) {
            let $form = $(plugins.rdMailForm[i]),
              formHasCaptcha = false;

            $form.attr('novalidate', 'novalidate').ajaxForm({
              data: {
                "form-type": $form.attr("data-form-type") || "contact",
                "counter": i
              },
              beforeSubmit: function (arr, $form, options) {
                if (isNoviBuilder)
                  return;

                let form = $(plugins.rdMailForm[this.extraData.counter]),
                  inputs = form.find("[data-constraints]"),
                  output = $("#" + form.attr("data-form-output")),
                  captcha = form.find('.recaptcha'),
                  captchaFlag = true;

                output.removeClass("active error success");

                if (isValidated(inputs, captcha)) {

                  // veify reCaptcha
                  if (captcha.length) {
                    let captchaToken = captcha.find('.g-recaptcha-response').val(),
                      captchaMsg = {
                        'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
                        'CPT002': 'Something wrong with google reCaptcha'
                      };

                    formHasCaptcha = true;

                    $.ajax({
                      method: "POST",
                      url: "bat/reCaptcha.php",
                      data: { 'g-recaptcha-response': captchaToken },
                      async: false
                    })
                      .done(function (responceCode) {
                        if (responceCode !== 'CPT000') {
                          if (output.hasClass("snackbars")) {
                            output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

                            setTimeout(function () {
                              output.removeClass("active");
                            }, 3500);

                            captchaFlag = false;
                          } else {
                            output.html(captchaMsg[responceCode]);
                          }

                          output.addClass("active");
                        }
                      });
                  }

                  if (!captchaFlag) {
                    return false;
                  }

                  form.addClass('form-in-process');

                  if (output.hasClass("snackbars")) {
                    output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
                    output.addClass("active");
                  }
                } else {
                  return false;
                }
              },
              error: function (result) {
                if (isNoviBuilder)
                  return;

                let output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
                  form = $(plugins.rdMailForm[this.extraData.counter]);

                output.text(msg[result]);
                form.removeClass('form-in-process');

                if (formHasCaptcha) {
                  grecaptcha.reset();
                  window.dispatchEvent(new Event('resize'));
                }
              },
              success: function (result) {
                if (isNoviBuilder)
                  return;

                let form = $(plugins.rdMailForm[this.extraData.counter]),
                  output = $("#" + form.attr("data-form-output")),
                  select = form.find('select');

                form
                  .addClass('success')
                  .removeClass('form-in-process');

                if (formHasCaptcha) {
                  grecaptcha.reset();
                  window.dispatchEvent(new Event('resize'));
                }

                result = result.length === 5 ? result : 'MF255';
                output.text(msg[result]);

                if (result === "MF000") {
                  if (output.hasClass("snackbars")) {
                    output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
                  } else {
                    output.addClass("active success");
                  }
                } else {
                  if (output.hasClass("snackbars")) {
                    output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
                  } else {
                    output.addClass("active error");
                  }
                }

                form.clearForm();

                if (select.length) {
                  select.val(null).trigger('change');
                }

                form.find('input, textarea').trigger('blur');

                setTimeout(function () {
                  output.removeClass("active error success");
                  form.removeClass('success');
                }, 3500);
              }
            });
          }
        }

        // lightGallery
        if (plugins.lightGallery.length) {
          for (var i = 0; i < plugins.lightGallery.length; i++) {
            initLightGallery(plugins.lightGallery[i]);
          }
        }

        // lightGallery item
        if (plugins.lightGalleryItem.length) {
          // Filter carousel items
          var notCarouselItems = [];

          for (var z = 0; z < plugins.lightGalleryItem.length; z++) {
            if (!$(plugins.lightGalleryItem[z]).parents('.owl-carousel').length &&
              !$(plugins.lightGalleryItem[z]).parents('.swiper-slider').length &&
              !$(plugins.lightGalleryItem[z]).parents('.slick-slider').length) {
              notCarouselItems.push(plugins.lightGalleryItem[z]);
            }
          }

          plugins.lightGalleryItem = notCarouselItems;

          for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
            initLightGalleryItem(plugins.lightGalleryItem[i]);
          }
        }

        // Dynamic lightGallery
        if (plugins.lightDynamicGalleryItem.length) {
          for (var i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
            initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
          }
        }

        // Custom Toggles
        if (plugins.customToggle.length) {
          for (var i = 0; i < plugins.customToggle.length; i++) {
            var $this = $(plugins.customToggle[i]);

            $this.on('click', $.proxy(function (event) {
              event.preventDefault();

              var $ctx = $(this);
              $($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
            }, $this));

            if ($this.attr("data-custom-toggle-hide-on-blur") === "true") {
              $body.on("click", $this, function (e) {
                if (e.target !== e.data[0]
                  && $(e.data.attr('data-custom-toggle')).find($(e.target)).length
                  && e.data.find($(e.target)).length === 0) {
                  $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
                }
              })
            }

            if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
              $body.on("click", $this, function (e) {
                if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length === 0 && e.data.find($(e.target)).length === 0) {
                  $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
                }
              })
            }
          }
        }

        // Countdown
        if (plugins.countdown.length) {
          for (var i = 0; i < plugins.countdown.length; i++) {
            var
              node = plugins.countdown[i],
              countdown = aCountdown({
                node: node,
                from: node.getAttribute('data-from'),
                to: node.getAttribute('data-to'),
                count: node.getAttribute('data-count'),
                tick: 100,
              });
          }
        }

        // Winona buttons
        if (plugins.buttonWinona.length && !isNoviBuilder) {
          initWinonaButtons(plugins.buttonWinona);
        }

        function initWinonaButtons(buttons) {
          for (var i = 0; i < buttons.length; i++) {
            var $button = $(buttons[i]),
              innerContent = $button.html();

            $button.html('');
            $button.append('<div class="content-original">' + innerContent + '</div>');
            $button.append('<div class="content-dubbed">' + innerContent + '</div>');
          }
        }

        // Select2
        if (plugins.selectFilter.length) {

          for (let i = 0; i < plugins.selectFilter.length; i++) {
            let select = $(plugins.selectFilter[i]),
              selectStyle = 'html-' + select.attr('data-style') + '-select';
            $html.addClass(selectStyle);

            select.select2({
              dropdownParent: $('.page'),
              placeholder: select.attr('data-placeholder') || null,
              minimumResultsForSearch: select.attr('data-minimum-results-search') || Infinity,
              maximumSelectionSize: 3
            });
          }
        }

        // Stepper
        if (plugins.stepper.length) {
          plugins.stepper.stepper({
            labels: {
              up: "",
              down: ""
            }
          });
        }

        // RD Range
        if (plugins.rdRange.length && !isNoviBuilder) {
          plugins.rdRange.RDRange({
            callbacks: {
              onChange: function () {
                var $inputs = $('.rd-range-input-value-1, .rd-range-input-value-2');

                for (var z = 0; z < $inputs.length; z++) {

                  if (isDesktop) {
                    $inputs[z].style.width = ($inputs[z].value.length + 1) * 1.15 + 'ch';
                  }
                }
              },
            }
          });
        }

        // Slick carousel
        if (plugins.slick.length) {
          for (var i = 0; i < plugins.slick.length; i++) {
            var $slickItem = $(plugins.slick[i]);

            $slickItem.on('init', function (slick) {
              initLightGallery($('[data-lightgallery="group-slick"]'), 'lightGallery-in-carousel');
              initLightGallery($('[data-lightgallery="item-slick"]'), 'lightGallery-in-carousel');
            });

            $slickItem.slick({
              slidesToScroll: parseInt($slickItem.attr('data-slide-to-scroll'), 10) || 1,
              asNavFor: $slickItem.attr('data-for') || false,
              dots: $slickItem.attr("data-dots") === "true",
              infinite: isNoviBuilder ? false : $slickItem.attr("data-loop") === "true",
              focusOnSelect: true,
              arrows: $slickItem.attr("data-arrows") === "true",
              swipe: $slickItem.attr("data-swipe") === "true",
              autoplay: $slickItem.attr("data-autoplay") === "true",
              centerMode: $slickItem.attr("data-center-mode") === "true",
              fade: $slickItem.attr("data-slide-effect") === "true",
              centerPadding: $slickItem.attr("data-center-padding") ? $slickItem.attr("data-center-padding") : '0.50',
              mobileFirst: true,
              appendArrows: $slickItem.attr("data-arrows-class") || $slickItem,
              nextArrow: $slickItem.attr('data-custom-arrows') === "true" ? '<button type="button" class="slick-next">' +
                '  <svg width="100%" height="100%" viewbox="0 0 78 78">' +
                '    <circle class="slick-button-line" cx="39" cy="39" r="36"></circle>' +
                '    <circle class="slick-button-line-2" cx="39" cy="39" r="36"></circle>' +
                '  </svg>' +
                '</button>' : '<button type="button" class="slick-next"></button>',
              prevArrow: $slickItem.attr('data-custom-arrows') === "true" ? '<button type="button" class="slick-prev">' +
                '  <svg width="100%" height="100%" viewbox="0 0 78 78">' +
                '    <circle class="slick-button-line" cx="39" cy="39" r="36"></circle>' +
                '    <circle class="slick-button-line-2" cx="39" cy="39" r="36"></circle>' +
                '  </svg>' +
                '</button>' : '<button type="button" class="slick-prev"></button>',
              responsive: [
                {
                  breakpoint: 0,
                  settings: {
                    slidesToShow: parseInt($slickItem.attr('data-items'), 10) || 1,
                    vertical: $slickItem.attr('data-vertical') === 'true' || false
                  }
                },
                {
                  breakpoint: 575,
                  settings: {
                    slidesToShow: parseInt($slickItem.attr('data-sm-items'), 10) || 1,
                    vertical: $slickItem.attr('data-sm-vertical') === 'true' || false
                  }
                },
                {
                  breakpoint: 767,
                  settings: {
                    slidesToShow: parseInt($slickItem.attr('data-md-items'), 10) || 1,
                    vertical: $slickItem.attr('data-md-vertical') === 'true' || false
                  }
                },
                {
                  breakpoint: 991,
                  settings: {
                    slidesToShow: parseInt($slickItem.attr('data-lg-items'), 10) || 1,
                    vertical: $slickItem.attr('data-lg-vertical') === 'true' || false
                  }
                },
                {
                  breakpoint: 1199,
                  settings: {
                    slidesToShow: parseInt($slickItem.attr('data-xl-items'), 10) || 1,
                    vertical: $slickItem.attr('data-xl-vertical') === 'true' || false
                  }
                }
              ]
            })

              .on('afterChange', function (event, slick, currentSlide, nextSlide) {
                var $this = $(this),
                  childCarousel = $this.attr('data-child');

                if (childCarousel) {
                  $(childCarousel + ' .slick-slide').removeClass('slick-current');
                  $(childCarousel + ' .slick-slide').eq(currentSlide).addClass('slick-current');
                }
              });

            if ($slickItem.attr('data-fraction')) {
              (function () {
                var fractionElement = document.querySelectorAll($slickItem.attr('data-fraction'))[0],
                  fractionCurrent = fractionElement.querySelectorAll('.slick-fraction-current')[0],
                  fractionAll = fractionElement.querySelectorAll('.slick-fraction-all')[0];

                $slickItem.on('afterChange', function (slick) {
                  fractionCurrent.innerText = leadingZero(this.slick.currentSlide + 1);
                  fractionAll.innerText = leadingZero(this.slick.slideCount);
                });

                $slickItem.trigger('afterChange');
              })();
            }
          }
        }

        function leadingZero(decimal) {
          return decimal < 10 && decimal > 0 ? '0' + decimal : decimal;
        }

        // Radio Panel
        if (plugins.radioPanel) {
          for (var i = 0; i < plugins.radioPanel.length; i++) {
            var $element = $(plugins.radioPanel[i]);
            $element.on('click', function () {
              plugins.radioPanel.removeClass('active');
              $(this).addClass('active');
            })
          }
        }

        // Hoverdir plugin
        if (plugins.hoverdir.length) {
          initHoverDir(plugins.hoverdir);
        }

        // Multitoggles
        if (plugins.multitoggle.length) {
          multitoggles();
        }

        // Custom Waypoints
        if (plugins.customWaypoints.length && !isNoviBuilder) {
          var i;
          for (i = 0; i < plugins.customWaypoints.length; i++) {
            var $this = $(plugins.customWaypoints[i]);

            $this.on('click', function (e) {
              e.preventDefault();

              $("body, html").stop().animate({
                scrollTop: $("#" + $(this).attr('data-custom-scroll-to')).offset().top
              }, 1000, function () {
                $window.trigger("resize");
              });
            });
          }
        }
      });
    }());

  }, [])
  return (
    <div>
      &lt;&gt;
      <div className="preloader">
        <div className="wrapper-triangle">
          <div className="pen">
            <div className="line-triangle">
              <div className="triangle" />
              <div className="triangle" />
              <div className="triangle" />
              <div className="triangle" />
              <div className="triangle" />
              <div className="triangle" />
              <div className="triangle" />
            </div>
            <div className="line-triangle">
              <div className="triangle" />
              <div className="triangle" />
              <div className="triangle" />
              <div className="triangle" />
              <div className="triangle" />
              <div className="triangle" />
              <div className="triangle" />
            </div>
            <div className="line-triangle">
              <div className="triangle" />
              <div className="triangle" />
              <div className="triangle" />
              <div className="triangle" />
              <div className="triangle" />
              <div className="triangle" />
              <div className="triangle" />
            </div>
          </div>
        </div>
      </div>
      <div className="page">
        {/* Page Header*/}
        <header className="section page-header">
          {/* RD Navbar*/}
          <div className="rd-navbar-wrap">
            <nav className="rd-navbar rd-navbar-modern" data-layout="rd-navbar-fixed" data-sm-layout="rd-navbar-fixed" data-md-layout="rd-navbar-fixed" data-md-device-layout="rd-navbar-fixed" data-lg-layout="rd-navbar-static" data-lg-device-layout="rd-navbar-fixed" data-xl-layout="rd-navbar-static" data-xl-device-layout="rd-navbar-static" data-xxl-layout="rd-navbar-static" data-xxl-device-layout="rd-navbar-static" data-lg-stick-up-offset="150px" data-xl-stick-up-offset="150px" data-xxl-stick-up-offset="150px" data-lg-stick-up="true" data-xl-stick-up="true" data-xxl-stick-up="true">
              <div className="rd-navbar-inner-outer">
                <div className="rd-navbar-inner">
                  {/* RD Navbar Panel*/}
                  <div className="rd-navbar-panel">
                    {/* RD Navbar Toggle*/}
                    <button className="rd-navbar-toggle" data-rd-navbar-toggle=".rd-navbar-nav-wrap"><span /></button>
                    {/* RD Navbar Brand*/}
                    <div className="rd-navbar-brand"><a className="brand" href="../index.html"><h3>Mine First</h3></a></div>
                  </div>
                  <div className="rd-navbar-right rd-navbar-nav-wrap">
                    <div className="rd-navbar-aside">
                      <ul className="rd-navbar-contacts-2">
                        <li>
                          <div className="unit unit-spacing-xs">
                            <div className="unit-left"><span className="icon mdi mdi-phone" /></div>
                            <div className="unit-body"><a className="phone" href="tel:#">+1 718-999-3939</a></div>
                          </div>
                        </li>
                        <li>
                          <div className="unit unit-spacing-xs">
                            <div className="unit-left"><span className="icon mdi mdi-map-marker" /></div>
                            <div className="unit-body"><a className="address" href="#">514 S. Magnolia St. Orlando, FL 32806</a></div>
                          </div>
                        </li>
                      </ul>
                      <ul className="list-share-2">
                        <li><a className="icon mdi mdi-facebook" href="#" /></li>
                        <li><a className="icon mdi mdi-twitter" href="#" /></li>
                        <li><a className="icon mdi mdi-instagram" href="#" /></li>
                        <li><a className="icon mdi mdi-google-plus" href="#" /></li>
                      </ul>
                    </div>
                    <div className="rd-navbar-main">
                      {/* RD Navbar Nav*/}
                      <ul className="rd-navbar-nav">
                        <li className="rd-nav-item active"><a className="rd-nav-link" href="../index.html">Home</a>
                          {/* RD Navbar Dropdown*/}
                          <ul className="rd-menu rd-navbar-dropdown">
                            <li className="rd-dropdown-item"><a className="rd-dropdown-link" href="index.html">Gas &amp; Oil</a></li>
                            <li className="rd-dropdown-item"><a className="rd-dropdown-link" href="mining.html">Mining</a></li>
                            <li className="rd-dropdown-item"><a className="rd-dropdown-link" href="welding.html">Welding</a></li>
                            <li className="rd-dropdown-item"><a className="rd-dropdown-link" href="steelworks.html">Steelworks</a></li>
                            <li className="rd-dropdown-item"><a className="rd-dropdown-link" href="cement.html">Cement</a></li>
                            <li className="rd-dropdown-item"><a className="rd-dropdown-link" href="civil-engineering.html">Civil Engineering</a></li>
                            <li className="rd-dropdown-item"><a className="rd-dropdown-link" href="woodworking.html">Woodworking</a></li>
                          </ul>
                        </li>
                        <li className="rd-nav-item"><a className="rd-nav-link" href="#">Pages</a>
                          {/* RD Navbar Megamenu*/}
                          <ul className="rd-menu rd-navbar-megamenu">
                            <li className="rd-megamenu-item">
                              <h6 className="rd-megamenu-title">Services</h6>
                              <ul className="rd-megamenu-list">
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="services.html">Services</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="services-2.html">Services 2</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="services-3.html">Services 3</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="services-4.html">Services 4</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="single-service.html">Single service</a></li>
                              </ul>
                            </li>
                            <li className="rd-megamenu-item">
                              <h6 className="rd-megamenu-title">Additional Pages</h6>
                              <ul className="rd-megamenu-list">
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="404-page.html">404 page</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="coming-soon.html">Coming soon</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="counters.html">Counters</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="icon-lists.html">Icon lists</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="search-results.html">Search results</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="privacy-policy.html">Privacy policy</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="contacts.html">Contacts</a></li>
                              </ul>
                            </li>
                            <li className="rd-megamenu-item">
                              <h6 className="rd-megamenu-title">Elements</h6>
                              <ul className="rd-megamenu-list">
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="typography.html">Typography</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="buttons.html">Buttons</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="forms.html">Forms</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="tabs-and-accordions.html">Tabs and accordions</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="progress-bars.html">Progress bars</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="grid-system.html">Grid system</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="tables.html">Tables</a></li>
                              </ul>
                            </li>
                            <li className="rd-megamenu-item">
                              <h6 className="rd-megamenu-title">Layouts</h6>
                              <ul className="rd-megamenu-list">
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="index.html">Gas &amp; Oil</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="mining.html">Mining</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="welding.html">Welding</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="steelworks.html">Steelworks</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="cement.html">Cement</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="civil-engineering.html">Civil Engineering</a></li>
                                <li className="rd-megamenu-list-item"><a className="rd-megamenu-list-link" href="woodworking.html">Woodworking</a></li>
                              </ul>
                            </li>
                          </ul>
                        </li>
                        <li className="rd-nav-item"><a className="rd-nav-link" href="about-us.html">About Us</a>
                        </li>
                        <li className="rd-nav-item"><a className="rd-nav-link" href="shop.html">Shop</a>
                          {/* RD Navbar Dropdown*/}
                          <ul className="rd-menu rd-navbar-dropdown">
                            <li className="rd-dropdown-item"><a className="rd-dropdown-link" href="shop.html">Shop</a></li>
                            <li className="rd-dropdown-item"><a className="rd-dropdown-link" href="single-product.html">Single product</a></li>
                            <li className="rd-dropdown-item"><a className="rd-dropdown-link" href="checkout.html">Checkout</a></li>
                            <li className="rd-dropdown-item"><a className="rd-dropdown-link" href="cart-page.html">Cart page</a></li>
                          </ul>
                        </li>
                        <li className="rd-nav-item"><a className="rd-nav-link" href="projects.html">Projects</a>
                          {/* RD Navbar Dropdown*/}
                          <ul className="rd-menu rd-navbar-dropdown">
                            <li className="rd-dropdown-item"><a className="rd-dropdown-link" href="projects.html">Projects</a></li>
                            <li className="rd-dropdown-item"><a className="rd-dropdown-link" href="grid-gallery.html">Grid Gallery</a></li>
                            <li className="rd-dropdown-item"><a className="rd-dropdown-link" href="project-page.html">Project page</a></li>
                          </ul>
                        </li>
                        <li className="rd-nav-item"><a className="rd-nav-link" href="grid-blog.html">News</a>
                          {/* RD Navbar Dropdown*/}
                          <ul className="rd-menu rd-navbar-dropdown">
                            <li className="rd-dropdown-item"><a className="rd-dropdown-link" href="grid-blog.html">Grid blog</a></li>
                            <li className="rd-dropdown-item"><a className="rd-dropdown-link" href="masonry-blog.html">Masonry blog</a></li>
                            <li className="rd-dropdown-item"><a className="rd-dropdown-link" href="blog-post.html">Blog post</a></li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="rd-navbar-project-hamburger rd-navbar-project-hamburger-open rd-navbar-fixed-element-1" data-multitoggle=".rd-navbar-inner" data-multitoggle-blur=".rd-navbar-wrap" data-multitoggle-isolate="data-multitoggle-isolate">
                    <div className="project-hamburger"><span className="project-hamburger-arrow" /><span className="project-hamburger-arrow" /><span className="project-hamburger-arrow" />
                    </div>
                  </div>
                  <div className="rd-navbar-project">
                    <div className="rd-navbar-project-header">
                      <h5 className="rd-navbar-project-title">Latest Projects</h5>
                      <div className="rd-navbar-project-hamburger rd-navbar-project-hamburger-close" data-multitoggle=".rd-navbar-inner" data-multitoggle-blur=".rd-navbar-wrap" data-multitoggle-isolate="data-multitoggle-isolate">
                        <div className="project-close"><span /><span /></div>
                      </div>
                    </div>
                    <div className="rd-navbar-project-content rd-navbar-content">
                      <div>
                        <div className="row gutters-20" data-lightgallery="group">
                          <div className="col-6">
                            {/* Thumbnail Creative*/}
                            <article className="thumbnail thumbnail-creative"><a href="images/mining/project-1-1200x800-original.jpg" data-lightgallery="item">
                              <div className="thumbnail-creative-figure"><img src="images/mining/project-1-195x164.jpg" alt width={195} height={164} />
                              </div>
                              <div className="thumbnail-creative-caption"><span className="icon thumbnail-creative-icon linearicons-magnifier" /></div></a></article>
                          </div>
                          <div className="col-6">
                            {/* Thumbnail Creative*/}
                            <article className="thumbnail thumbnail-creative"><a href="images/mining/project-2-1200x800-original.jpg" data-lightgallery="item">
                              <div className="thumbnail-creative-figure"><img src="images/mining/project-2-195x164.jpg" alt width={195} height={164} />
                              </div>
                              <div className="thumbnail-creative-caption"><span className="icon thumbnail-creative-icon linearicons-magnifier" /></div></a></article>
                          </div>
                          <div className="col-6">
                            {/* Thumbnail Creative*/}
                            <article className="thumbnail thumbnail-creative"><a href="images/mining/project-3-1200x800-original.jpg" data-lightgallery="item">
                              <div className="thumbnail-creative-figure"><img src="images/mining/project-3-195x164.jpg" alt width={195} height={164} />
                              </div>
                              <div className="thumbnail-creative-caption"><span className="icon thumbnail-creative-icon linearicons-magnifier" /></div></a></article>
                          </div>
                          <div className="col-6">
                            {/* Thumbnail Creative*/}
                            <article className="thumbnail thumbnail-creative"><a href="images/mining/project-4-1200x800-original.jpg" data-lightgallery="item">
                              <div className="thumbnail-creative-figure"><img src="images/mining/project-4-195x164.jpg" alt width={195} height={164} />
                              </div>
                              <div className="thumbnail-creative-caption"><span className="icon thumbnail-creative-icon linearicons-magnifier" /></div></a></article>
                          </div>
                          <div className="col-6">
                            {/* Thumbnail Creative*/}
                            <article className="thumbnail thumbnail-creative"><a href="images/mining/project-5-1200x800-original.jpg" data-lightgallery="item">
                              <div className="thumbnail-creative-figure"><img src="images/mining/project-5-195x164.jpg" alt width={195} height={164} />
                              </div>
                              <div className="thumbnail-creative-caption"><span className="icon thumbnail-creative-icon linearicons-magnifier" /></div></a></article>
                          </div>
                          <div className="col-6">
                            {/* Thumbnail Creative*/}
                            <article className="thumbnail thumbnail-creative"><a href="images/mining/project-6-1200x800-original.jpg" data-lightgallery="item">
                              <div className="thumbnail-creative-figure"><img src="images/mining/project-6-195x164.jpg" alt width={195} height={164} />
                              </div>
                              <div className="thumbnail-creative-caption"><span className="icon thumbnail-creative-icon linearicons-magnifier" /></div></a></article>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </header>
        {/* Swiper*/}
        <section className="section swiper-container swiper-slider swiper-slider-2" data-loop="true" data-autoplay={5000} data-simulate-touch="false" data-slide-effect="fade">
          <div className="swiper-wrapper text-sm-start">
            <div className="swiper-slide context-dark" data-slide-bg="images/mining/slide-1-1920x753.jpg">
              <div className="swiper-slide-caption section-md">
                <div className="container">
                  <div className="row">
                    <div className="col-sm-8 col-md-7 col-lg-6 offset-lg-1 offset-xxl-0">
                      <h3 className="oh swiper-title"><span className="d-inline-block" data-caption-animate="slideInUp" data-caption-delay={0}>Équipement minier fiable</span></h3>
                      <h5 className="swiper-subtitle" data-caption-animate="fadeInLeft" data-caption-delay={300}>Nous utilisons les derniers outils &amp; machines pour l'exploitation minière</h5><a className="button button-lg button-secondary button-winona button-shadow-2" href="#" data-caption-animate="fadeInUp" data-caption-delay={300}>View more</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-slide context-dark" data-slide-bg="images/mining/slide-2-1920x753.jpg">
              <div className="swiper-slide-caption section-md">
                <div className="container">
                  <div className="row">
                    <div className="col-sm-9 col-md-8 col-xl-6 offset-lg-1 offset-xxl-0">
                      <h3 className="oh swiper-title"><span className="d-inline-block" data-caption-animate="slideInDown" data-caption-delay={0}>Avant-garde <br />technologie minière</span></h3>
                      <h5 className="swiper-subtitle" data-caption-animate="fadeInRight" data-caption-delay={300}>Intégrer un cycle de production minérale innovant</h5>
                      <div className="button-wrap oh"><a className="button button-lg button-secondary button-winona button-shadow-2" href="#" data-caption-animate="slideInUp" data-caption-delay={0}>View more</a></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-slide context-dark" data-slide-bg="images/mining/slide-3-1920x753.jpg">
              <div className="swiper-slide-caption section-md">
                <div className="container">
                  <div className="row">
                    <div className="col-sm-8 col-md-7 col-xl-6 offset-lg-1 offset-xxl-0">
                      <h3 className="oh swiper-title"><span className="d-inline-block" data-caption-animate="slideInLeft" data-caption-delay={100}>Trusted industry leader</span></h3>
                      <h5 className="swiper-subtitle" data-caption-animate="fadeInUp" data-caption-delay={0}>Mining company with 50 years of experience</h5>
                      <div className="button-wrap oh"><a className="button button-lg button-secondary button-winona button-shadow-2" href="#" data-caption-animate="slideInLeft" data-caption-delay={100}>View more</a></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-slide context-dark" data-slide-bg="images/mining/slide-4-1920x753.jpg">
              <div className="swiper-slide-caption section-md">
                <div className="container">
                  <div className="row">
                    <div className="col-sm-10 col-md-8 col-lg-7 offset-lg-1 offset-xxl-0">
                      <h3 className="oh swiper-title"><span className="d-inline-block" data-caption-animate="slideInUp" data-caption-delay={0}>Professional <br />mineral exploration</span></h3>
                      <h5 className="swiper-subtitle" data-caption-animate="fadeInRight" data-caption-delay={300}>Delivering the best mining solutions</h5>
                      <div className="button-wrap oh"><a className="button button-lg button-secondary button-winona button-shadow-2" href="#" data-caption-animate="fadeInDown" data-caption-delay={0}>View more</a></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Swiper Pagination*/}
          <div className="swiper-pagination" data-bullet-custom="true" />
          {/* Swiper Navigation*/}
          <div className="swiper-button-prev">
            <div className="preview">
              <div className="preview__img" />
            </div>
            <div className="swiper-button-arrow" />
          </div>
          <div className="swiper-button-next">
            <div className="swiper-button-arrow" />
            <div className="preview">
              <div className="preview__img" />
            </div>
          </div>
        </section>
        {/* About Company*/}
        <section className="section section-md section-lg-0 bg-gray-100 text-md-start section-relative" id="about">
          <div className="tabs-custom container" id="tabs-8">
            <div className="row row-40 flex-lg-row-reverse">
              <div className="col-lg-4">
                <div className="nav-tabs-2-button">
                  <h5 className="nav-tabs-2-title">About Company</h5><span className="icon mdi mdi-arrow-down" data-custom-scroll-to="about" />
                </div>
                <ul className="nav nav-tabs-2">
                  <li className="nav-item-2 wow fadeInRight" role="presentation"><a className="active" href="#tabs-8-1" data-bs-toggle="tab">Valeurs de Mine First</a></li>
                  <li className="nav-item-2 wow fadeInRight" role="presentation"><a href="#tabs-8-2" data-bs-toggle="tab">Notre mission</a></li>
                  <li className="nav-item-2 wow fadeInRight" role="presentation"><a href="#tabs-8-3" data-bs-toggle="tab">Notre vision</a></li>
                  {/* <li className="nav-item-2 wow fadeInRight" role="presentation"><a href="#tabs-8-4" data-bs-toggle="tab">View report</a></li> */}
                </ul>
              </div>
              <div className="col-lg-8 tab-content-2 wow fadeInLeft">
                <div className="tab-content">
                  <div className="tab-pane fade show active" id="tabs-8-1">
                    <div className="row row-40 row-lg-50 row-xl-60">
                      <div className="col-sm-6">
                        <article className="box-icon-classic">
                          <div className="unit unit-spacing-lg flex-column text-center flex-md-row text-md-start">
                            <div className="unit-left">
                              <div className="box-icon-classic-icon linearicons-hammer-wrench" />
                            </div>
                            <div className="unit-body">
                              <h5 className="box-icon-classic-title"><a href="single-service.html">Integrity</a></h5>
                              <p className="box-icon-classic-text">We have an uncompromising commitment to ethics and zero harm. We care about everyone.</p>
                            </div>
                          </div>
                        </article>
                      </div>
                      <div className="col-sm-6">
                        <article className="box-icon-classic">
                          <div className="unit unit-spacing-lg flex-column text-center flex-md-row text-md-start">
                            <div className="unit-left">
                              <div className="box-icon-classic-icon linearicons-map-marker-check" />
                            </div>
                            <div className="unit-body">
                              <h5 className="box-icon-classic-title"><a href="single-service.html">Respect</a></h5>
                              <p className="box-icon-classic-text">We hold each other, our customers, and the industries we serve in the highest regard.</p>
                            </div>
                          </div>
                        </article>
                      </div>
                      <div className="col-sm-6">
                        <article className="box-icon-classic">
                          <div className="unit unit-spacing-lg flex-column text-center flex-md-row text-md-start">
                            <div className="unit-left">
                              <div className="box-icon-classic-icon linearicons-users2" />
                            </div>
                            <div className="unit-body">
                              <h5 className="box-icon-classic-title"><a href="single-service.html">Teamwork</a></h5>
                              <p className="box-icon-classic-text">We work together to achieve results and to solve your toughest challenges.</p>
                            </div>
                          </div>
                        </article>
                      </div>
                      <div className="col-sm-6">
                        <article className="box-icon-classic">
                          <div className="unit unit-spacing-lg flex-column text-center flex-md-row text-md-start">
                            <div className="unit-left">
                              <div className="box-icon-classic-icon linearicons-leaf" />
                            </div>
                            <div className="unit-body">
                              <h5 className="box-icon-classic-title"><a href="single-service.html">Diversity</a></h5>
                              <p className="box-icon-classic-text">We appreciate our differences and embrace a broad range of perspectives and cultures.</p>
                            </div>
                          </div>
                        </article>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="tabs-8-2">
                    <div className="box-info">
                      <div className="unit flex-column flex-md-row align-items-center">
                        <div className="unit-left">
                          <div className="box-info-figure"><img src="images/mining/about-1-326x390.jpg" alt width={326} height={390} />
                          </div>
                        </div>
                        <div className="unit-body">
                          <div className="box-info-content">
                            <h5 className="box-info-title">Notre mission</h5>
                            <p className="box-info-text">Nous sommes une société minière responsable qui découvre et traite des minéraux et des ressources énergétiques pour l’usage de la société. Notre société s'associe directement avec ses clients pour leur permettre d'atteindre le zéro dommage, la production la plus élevée et le coût de cycle de vie le plus bas pour leurs opérations minières, tout en faisant de chaque client une référence.</p><a className="box-info-link" href="#">Lire plus</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="tabs-8-3">
                    <div className="box-info">
                      <div className="unit flex-column flex-md-row align-items-center">
                        <div className="unit-left">
                          <div className="box-info-figure"><img src="images/mining/about-2-326x390.jpg" alt width={326} height={390} />
                          </div>
                        </div>
                        <div className="unit-body">
                          <div className="box-info-content">
                            <h5 className="box-info-title">Notre vision</h5>
                            <p className="box-info-text">Our vision is to be a highly respected, world-class natural-resource company committed to deliver excellent value to its investors, employees, and other stakeholders. We aspire to be a world-class service company delivering the most reliable and efficient products, systems, and solutions that solve the toughest mining challenges.</p><a className="box-info-link" href="#">Read More</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="tabs-8-4">
                    <div className="box-info">
                      <div className="unit flex-column flex-md-row align-items-center">
                        <div className="unit-left">
                          <div className="box-info-figure"><img src="images/mining/about-3-326x390.jpg" alt width={326} height={390} />
                          </div>
                        </div>
                        <div className="unit-body">
                          <div className="box-info-content">
                            <h5 className="box-info-title">2023 Annual Report</h5>
                            <p className="box-info-text">We began this year with a celebration of our 50 years in business, a milestone that is particularly significant for a mining company. We ended the year strongly with the most silver production and the highest revenue in our company’s history. The 17.2 million ounces of silver we produced marked our third year of record-breaking production.</p><a className="box-info-link" href="#">Read More</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* What we offer*/}
        <section className="section section-lg bg-default">
          <div className="container">
            <h3 className="oh-desktop"><span className="d-inline-block wow slideInDown">CE QUE NOUS OFFRONS</span></h3>
            <div className="owl-carousel owl-style-3 dots-style-2" data-items={1} data-sm-items={2} data-lg-items={3} data-margin={30} data-autoplay="true" data-dots="true" data-animation-in="fadeIn" data-animation-out="fadeOut">
              {/* Services Creative*/}
              <article className="services-creative"><a className="services-creative-figure" href="single-service.html"><img src="images/mining/services-1-370x230.jpg" alt width={370} height={230} /></a>
                <div className="services-creative-caption">
                  <h5 className="services-creative-title"><a href="single-service.html">Production minérale</a></h5>
                  <p className="services-creative-text">Nous explorons, développons et produisons divers minéraux dans des mines du monde entier</p><span className="services-creative-counter box-ordered-item">01</span>
                </div>
              </article>
              {/* Services Creative*/}
              <article className="services-creative"><a className="services-creative-figure" href="single-service.html"><img src="images/mining/services-2-370x230.jpg" alt width={370} height={230} /></a>
                <div className="services-creative-caption">
                  <h5 className="services-creative-title"><a href="single-service.html">Coal Mining</a></h5>
                  <p className="services-creative-text">Our company is one of the most reliable providers of coal mining services.</p><span className="services-creative-counter box-ordered-item">02</span>
                </div>
              </article>
              {/* Services Creative*/}
              <article className="services-creative"><a className="services-creative-figure" href="single-service.html"><img src="images/mining/services-3-370x230.jpg" alt width={370} height={230} /></a>
                <div className="services-creative-caption">
                  <h5 className="services-creative-title"><a href="single-service.html">Équipement de minage</a></h5>
                  <p className="services-creative-text">We offer a wide variety of professional mining equipment and machinery.</p><span className="services-creative-counter box-ordered-item">03</span>
                </div>
              </article>
              {/* Services Creative*/}
              <article className="services-creative"><a className="services-creative-figure" href="single-service.html"><img src="images/services-7-370x230.jpg" alt width={370} height={230} /></a>
                <div className="services-creative-caption">
                  <h5 className="services-creative-title"><a href="single-service.html">Équipe expérimentée</a></h5>
                  <p className="services-creative-text">We employ the best industry experts who help us provide unique mining solutions.</p><span className="services-creative-counter box-ordered-item">04</span>
                </div>
              </article>
              {/* Services Creative*/}
              <article className="services-creative"><a className="services-creative-figure" href="single-service.html"><img src="images/services-19-370x230.jpg" alt width={370} height={230} /></a>
                <div className="services-creative-caption">
                  <h5 className="services-creative-title"><a href="single-service.html">Technologie moderne</a></h5>
                  <p className="services-creative-text">Our company uses top-notch technology to make mining safer and more productive.</p><span className="services-creative-counter box-ordered-item">05</span>
                </div>
              </article>
              {/* Services Creative*/}
              <article className="services-creative"><a className="services-creative-figure" href="single-service.html"><img src="images/services-20-370x230.jpg" alt width={370} height={230} /></a>
                <div className="services-creative-caption">
                  <h5 className="services-creative-title"><a href="single-service.html">Matériaux de qualité</a></h5>
                  <p className="services-creative-text">High-quality materials we use are the absolute guarantee of our customers’ satisfaction.</p><span className="services-creative-counter box-ordered-item">06</span>
                </div>
              </article>
            </div>
          </div>
        </section>
        {/* Section CTA*/}
        <section className="section parallax-container" data-parallax-img="images/bg-cta.jpg">
          <div className="parallax-content section-lg context-dark text-md-start">
            <div className="container">
              <div className="row justify-content-end">
                <div className="col-sm-7 col-md-6 col-lg-5">
                  <div className="cta-classic">
                    <h4 className="cta-classic-title wow fadeInLeft">Use our expertise to find the right  solutions</h4>
                    <p className="cta-classic-text wow fadeInRight" data-wow-delay=".1s">Efficient mining solutions for companies worldwide</p><a className="button button-lg button-secondary button-winona wow fadeInUp" href="services.html" data-wow-delay=".2s">Our services</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Mining machinery*/}
        <section className="section section-xl bg-default text-center">
          <div className="container">
            <h3 className="oh-desktop"><span className="d-inline-block wow slideInUp">Machines minières</span></h3>
          </div>
          <div className="container-fluid container-inset-0">
            <div className="row row-30 row-desktop-8 gutters-8 hoverdir" data-lightgallery="group">
              <div className="col-sm-6 col-lg-4 col-xxl-3">
                <div className="oh-desktop">
                  {/* Thumbnail Modern*/}
                  <article className="thumbnail thumbnail-modern block-1 wow slideInUp hoverdir-item" data-hoverdir-target=".thumbnail-modern-caption"><a className="thumbnail-modern-figure" href="images/mining/grid-gallery-1-1200x800-original.jpg" data-lightgallery="item"><img src="images/mining/grid-gallery-1-474x355.jpg" alt width={474} height={355} /></a>
                    <div className="thumbnail-modern-caption">
                      <h5 className="thumbnail-modern-title"><a href="project-page.html">Graders</a></h5>
                      <div className="thumbnail-modern-badge">$90\hour</div>
                    </div>
                  </article>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4 col-xxl-3">
                <div className="oh-desktop">
                  {/* Thumbnail Modern*/}
                  <article className="thumbnail thumbnail-modern block-1 wow slideInDown hoverdir-item" data-hoverdir-target=".thumbnail-modern-caption"><a className="thumbnail-modern-figure" href="images/mining/grid-gallery-2-1200x800-original.jpg" data-lightgallery="item"><img src="images/mining/grid-gallery-2-474x355.jpg" alt width={474} height={355} /></a>
                    <div className="thumbnail-modern-caption">
                      <h5 className="thumbnail-modern-title"><a href="project-page.html">Bulldozers</a></h5>
                      <div className="thumbnail-modern-badge">$95\hour</div>
                    </div>
                  </article>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4 col-xxl-3">
                <div className="oh-desktop">
                  {/* Thumbnail Modern*/}
                  <article className="thumbnail thumbnail-modern block-1 wow slideInUp hoverdir-item" data-hoverdir-target=".thumbnail-modern-caption"><a className="thumbnail-modern-figure" href="images/mining/grid-gallery-3-1200x800-original.jpg" data-lightgallery="item"><img src="images/mining/grid-gallery-3-474x355.jpg" alt width={474} height={355} /></a>
                    <div className="thumbnail-modern-caption">
                      <h5 className="thumbnail-modern-title"><a href="project-page.html">Mini-loaders</a></h5>
                      <div className="thumbnail-modern-badge">$92\hour</div>
                    </div>
                  </article>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4 col-xxl-3">
                <div className="oh-desktop">
                  {/* Thumbnail Modern*/}
                  <article className="thumbnail thumbnail-modern block-1 wow slideInDown hoverdir-item" data-hoverdir-target=".thumbnail-modern-caption"><a className="thumbnail-modern-figure" href="images/mining/grid-gallery-4-1200x800-original.jpg" data-lightgallery="item"><img src="images/mining/grid-gallery-4-474x355.jpg" alt width={474} height={355} /></a>
                    <div className="thumbnail-modern-caption">
                      <h5 className="thumbnail-modern-title"><a href="project-page.html">Backhoes</a></h5>
                      <div className="thumbnail-modern-badge">$99\hour</div>
                    </div>
                  </article>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4 col-xxl-3">
                <div className="oh-desktop">
                  {/* Thumbnail Modern*/}
                  <article className="thumbnail thumbnail-modern block-1 wow slideInDown hoverdir-item" data-hoverdir-target=".thumbnail-modern-caption"><a className="thumbnail-modern-figure" href="images/mining/grid-gallery-5-1200x800-original.jpg" data-lightgallery="item"><img src="images/mining/grid-gallery-5-474x355.jpg" alt width={474} height={355} /></a>
                    <div className="thumbnail-modern-caption">
                      <h5 className="thumbnail-modern-title"><a href="project-page.html">Earth moving equipment</a></h5>
                      <div className="thumbnail-modern-badge">$89\hour</div>
                    </div>
                  </article>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4 col-xxl-3">
                <div className="oh-desktop">
                  {/* Thumbnail Modern*/}
                  <article className="thumbnail thumbnail-modern block-1 wow slideInUp hoverdir-item" data-hoverdir-target=".thumbnail-modern-caption"><a className="thumbnail-modern-figure" href="images/mining/grid-gallery-6-1200x800-original.jpg" data-lightgallery="item"><img src="images/mining/grid-gallery-6-474x355.jpg" alt width={474} height={355} /></a>
                    <div className="thumbnail-modern-caption">
                      <h5 className="thumbnail-modern-title"><a href="project-page.html">Excavators</a></h5>
                      <div className="thumbnail-modern-badge">$85\hour</div>
                    </div>
                  </article>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4 col-xxl-3">
                <div className="oh-desktop">
                  {/* Thumbnail Modern*/}
                  <article className="thumbnail thumbnail-modern block-1 wow slideInDown hoverdir-item" data-hoverdir-target=".thumbnail-modern-caption"><a className="thumbnail-modern-figure" href="images/mining/grid-gallery-7-1200x800-original.jpg" data-lightgallery="item"><img src="images/mining/grid-gallery-7-474x355.jpg" alt width={474} height={355} /></a>
                    <div className="thumbnail-modern-caption">
                      <h5 className="thumbnail-modern-title"><a href="project-page.html">Bucket-wheel excavators</a></h5>
                      <div className="thumbnail-modern-badge">$94\hour</div>
                    </div>
                  </article>
                </div>
              </div>
              <div className="col-sm-6 col-lg-4 col-xxl-3">
                <div className="oh-desktop">
                  {/* Thumbnail Modern*/}
                  <article className="thumbnail thumbnail-modern block-1 wow slideInUp hoverdir-item" data-hoverdir-target=".thumbnail-modern-caption"><a className="thumbnail-modern-figure" href="images/mining/grid-gallery-8-1200x800-original.jpg" data-lightgallery="item"><img src="images/mining/grid-gallery-8-474x355.jpg" alt width={474} height={355} /></a>
                    <div className="thumbnail-modern-caption">
                      <h5 className="thumbnail-modern-title"><a href="project-page.html">Heavy Mining Equipment</a></h5>
                      <div className="thumbnail-modern-badge">$97\hour</div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Latest Project*/}
        <section className="section section-inset-8 bg-image-5 context-dark text-center">
          <div className="container">
            <h3 className="oh-desktop"><span className="d-inline-block wow slideInDown">Dernier projets</span></h3>
            <div className="owl-style-4">
              <div className="owl-carousel dots-style-2" data-items={1} data-md-items={2} data-margin={30} data-md-margin={0} data-nav="true" data-dots="true" data-smart-speed={400} data-autoplay="true">
                {/* Project Classic*/}
                <article className="project-classic"><a className="project-classic-figure" href="project-page.html"><img src="images/mining/project-7-570x370.jpg" alt width={570} height={370} /></a>
                  <div className="project-classic-caption">
                    <h5 className="project-classic-title"><a href="project-page.html">Dickinson Iron Ore Mine Engineering, Procurement, and Equipment Setup</a></h5>
                    <div className="project-classic-location"><span className="icon mdi mdi-map-marker" /><span>North Dakota</span></div>
                    <p className="project-classic-text">This project included improvements that allowed the mine to process better ore with more fines.</p>
                  </div>
                </article>
                {/* Project Classic*/}
                <article className="project-classic"><a className="project-classic-figure" href="project-page.html"><img src="images/mining/project-8-570x370.jpg" alt width={570} height={370} /></a>
                  <div className="project-classic-caption">
                    <h5 className="project-classic-title"><a href="project-page.html">Midland Phosphate Mine: Mining Machinery &amp; Additional Services</a></h5>
                    <div className="project-classic-location"><span className="icon mdi mdi-map-marker" /><span>Texas</span></div>
                    <p className="project-classic-text">We are providing this mine with some heavy machinery and contract mining services.</p>
                  </div>
                </article>
                {/* Project Classic*/}
                <article className="project-classic"><a className="project-classic-figure" href="project-page.html"><img src="images/mining/project-9-570x370.jpg" alt width={570} height={370} /></a>
                  <div className="project-classic-caption">
                    <h5 className="project-classic-title"><a href="project-page.html">Dickinson Iron Ore Mine Engineering, Procurement, and Equipment Setup</a></h5>
                    <div className="project-classic-location"><span className="icon mdi mdi-map-marker" /><span>North Dakota</span></div>
                    <p className="project-classic-text">This project included improvements that allowed the mine to process better ore with more fines.</p>
                  </div>
                </article>
                {/* Project Classic*/}
                <article className="project-classic"><a className="project-classic-figure" href="project-page.html"><img src="images/mining/project-10-570x370.jpg" alt width={570} height={370} /></a>
                  <div className="project-classic-caption">
                    <h5 className="project-classic-title"><a href="project-page.html">Midland Phosphate Mine: Mining Machinery &amp; Additional Services</a></h5>
                    <div className="project-classic-location"><span className="icon mdi mdi-map-marker" /><span>Texas</span></div>
                    <p className="project-classic-text">We are providing this mine with some heavy machinery and contract mining services.</p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>
        {/* Section*/}
        <section className="section section-xl bg-gray-100 text-md-start">
          <div className="container">
            <div className="row row-60 justify-content-center flex-lg-row-reverse">
              <div className="col-md-8 col-lg-6 col-xl-5">
                <div className="offset-left-xl-70">
                  <h3 className="oh-desktop"><span className="d-inline-block wow slideInLeft">Nos clients</span></h3>
                  <div className="slick-quote">
                    {/* Slick Carousel*/}
                    <div className="slick-slider carousel-parent" data-autoplay="true" data-swipe="true" data-items={1} data-child="#child-carousel-2" data-for="#child-carousel-2" data-slide-effect="true">
                      <div className="item">
                        {/* Quote Modern*/}
                        <article className="quote-modern">
                          <h5 className="quote-modern-text"><span className="q">Minerals provided us with timely and efficient service. They showed a willingness throughout the process and solved all mining-related issues.</span></h5>
                          <h5 className="quote-modern-author">Stephen Adams,</h5>
                          <p className="quote-modern-status">“AlphaIndustry”, CEO</p>
                        </article>
                      </div>
                      <div className="item">
                        {/* Quote Modern*/}
                        <article className="quote-modern">
                          <h5 className="quote-modern-text"><span className="q">Their team helped us a lot during a complex process of finding candidates for a new department that opened at our iron ore plant this year.</span></h5>
                          <h5 className="quote-modern-author">Sam Peterson,</h5>
                          <p className="quote-modern-status">“South East Plant”, Lead HR Manager</p>
                        </article>
                      </div>
                      <div className="item">
                        {/* Quote Modern*/}
                        <article className="quote-modern">
                          <h5 className="quote-modern-text"><span className="q">It has been a pleasure to work with your team. You are a trusted partner in coal exploration, development, and further processing.</span></h5>
                          <h5 className="quote-modern-author">Jane McMillan,</h5>
                          <p className="quote-modern-status">“West Coal Plant”, CFO</p>
                        </article>
                      </div>
                      <div className="item">
                        {/* Quote Modern*/}
                        <article className="quote-modern">
                          <h5 className="quote-modern-text"><span className="q">Your help with our recent project was invaluable! Your sales team did a great work in organization of diamond supply process and we appreciate it a lot.</span></h5>
                          <h5 className="quote-modern-author">Will Jones,</h5>
                          <p className="quote-modern-status">“STC Diamond Mine”, Sales Manager</p>
                        </article>
                      </div>
                    </div>
                    <div className="slick-slider child-carousel" id="child-carousel-2" data-arrows="true" data-for=".carousel-parent" data-items={4} data-sm-items={4} data-md-items={4} data-lg-items={4} data-xl-items={4} data-slide-to-scroll={1}>
                      <div className="item"><img className="img-circle" src="images/team-5-83x83.jpg" alt width={83} height={83} />
                      </div>
                      <div className="item"><img className="img-circle" src="images/team-6-83x83.jpg" alt width={83} height={83} />
                      </div>
                      <div className="item"><img className="img-circle" src="images/team-7-83x83.jpg" alt width={83} height={83} />
                      </div>
                      <div className="item"><img className="img-circle" src="images/team-8-83x83.jpg" alt width={83} height={83} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-xl-7">
                {/* Clients Classic*/}
                <div className="clients-classic-wrap">
                  <div className="row g-0">
                    <div className="col-sm-6 wow fadeInLeft">
                      <div className="clients-classic"><a className="clients-classic-figure" href="#"><img src="images/clients-1-200x90.png" alt width={200} height={90} /></a></div>
                    </div>
                    <div className="col-sm-6 wow fadeInRight">
                      <div className="clients-classic"><a className="clients-classic-figure" href="#"><img src="images/clients-2-200x90.png" alt width={200} height={90} /></a></div>
                    </div>
                  </div>
                  <div className="row g-0">
                    <div className="col-sm-6 wow fadeInLeft">
                      <div className="clients-classic"><a className="clients-classic-figure" href="#"><img src="images/clients-3-200x90.png" alt width={200} height={90} /></a></div>
                    </div>
                    <div className="col-sm-6 wow fadeInRight">
                      <div className="clients-classic"><a className="clients-classic-figure" href="#"><img src="images/clients-4-200x90.png" alt width={200} height={90} /></a></div>
                    </div>
                  </div>
                  <div className="row g-0">
                    <div className="col-sm-6 wow fadeInLeft">
                      <div className="clients-classic"><a className="clients-classic-figure" href="#"><img src="images/clients-5-200x90.png" alt width={200} height={90} /></a></div>
                    </div>
                    <div className="col-sm-6 wow fadeInRight">
                      <div className="clients-classic"><a className="clients-classic-figure" href="#"><img src="images/clients-6-200x90.png" alt width={200} height={90} /></a></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section parallax-container" data-parallax-img="images/bg-counter-3.jpg">
          <div className="parallax-content section-inset-9 context-dark">
            <div className="container">
              <div className="row row-30 justify-content-center justify-content-xl-between align-items-lg-end">
                <div className="col-sm-6 col-md-3">
                  <div className="counter-classic">
                    <h3 className="counter-classic-number"><span className="counter">640</span>
                    </h3>
                    <h6 className="counter-classic-title">projects</h6>
                    <div className="counter-classic-decor" />
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">
                  <div className="counter-classic">
                    <h3 className="counter-classic-number"><span className="counter">15</span>
                    </h3>
                    <h6 className="counter-classic-title">awards won</h6>
                    <div className="counter-classic-decor" />
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">
                  <div className="counter-classic">
                    <h3 className="counter-classic-number"><span className="counter">24</span>
                    </h3>
                    <h6 className="counter-classic-title">partners</h6>
                    <div className="counter-classic-decor" />
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">
                  <div className="counter-classic">
                    <h3 className="counter-classic-number"><span className="counter">15</span>
                    </h3>
                    <h6 className="counter-classic-title">new clients</h6>
                    <div className="counter-classic-decor" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Section*/}
        <section className="section section-xl bg-default text-md-start">
          <div className="container">
            <div className="row row-30">
              <div className="col-md-5 col-lg-4 col-xl-3">
                <div className="box-team">
                  <h3 className="oh-desktop"><span className="d-inline-block wow slideInUp">Notre équipe</span></h3>
                  <h6 className="title-style-1 wow fadeInLeft" data-wow-delay=".1s">Gestion minière professionnelle</h6>
                  <p className="wow fadeInRight" data-wow-delay=".2s">Minerals est une équipe de professionnels miniers dévoués possédant plus de 20 ans d’expérience.</p>
                  <div className="group-sm oh-desktop">
                    <div className="button-style-1 wow slideInLeft"><span className="icon mdi mdi-email-outline" /><span className="button-style-1-text"><a href="contacts.html">Contact us</a></span></div>
                    <div className="wow slideInRight">
                      <div className="owl-custom-nav" id="owl-custom-nav-1" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-7 col-lg-8 col-xl-9">
                <div className="owl-carousel owl-style-5" data-items={1} data-sm-items={2} data-lg-items={3} data-margin={30} data-autoplay="false" data-animation-in="fadeIn" data-animation-out="fadeOut" data-navigation-class="#owl-custom-nav-1">
                  {/* Team Modern*/}
                  <article className="team-modern"><a className="team-modern-figure" href="#"><img src="images/team-18-270x236.jpg" alt width={270} height={236} /></a>
                    <div className="team-modern-caption">
                      <h6 className="team-modern-name"><a href="#">Frank McMillan</a></h6>
                      <div className="team-modern-status">CEO, Managing Director</div>
                      <ul className="list-inline team-modern-social-list">
                        <li><a className="icon mdi mdi-facebook" href="#" /></li>
                        <li><a className="icon mdi mdi-twitter" href="#" /></li>
                        <li><a className="icon mdi mdi-instagram" href="#" /></li>
                        <li><a className="icon mdi mdi-google-plus" href="#" /></li>
                      </ul>
                    </div>
                  </article>
                  {/* Team Modern*/}
                  <article className="team-modern"><a className="team-modern-figure" href="#"><img src="images/team-19-270x236.jpg" alt width={270} height={236} /></a>
                    <div className="team-modern-caption">
                      <h6 className="team-modern-name"><a href="#">John Smith</a></h6>
                      <div className="team-modern-status">Head of Geology</div>
                      <ul className="list-inline team-modern-social-list">
                        <li><a className="icon mdi mdi-facebook" href="#" /></li>
                        <li><a className="icon mdi mdi-twitter" href="#" /></li>
                        <li><a className="icon mdi mdi-instagram" href="#" /></li>
                        <li><a className="icon mdi mdi-google-plus" href="#" /></li>
                      </ul>
                    </div>
                  </article>
                  {/* Team Modern*/}
                  <article className="team-modern"><a className="team-modern-figure" href="#"><img src="images/team-3-270x236.jpg" alt width={270} height={236} /></a>
                    <div className="team-modern-caption">
                      <h6 className="team-modern-name"><a href="#">Ben Wilson</a></h6>
                      <div className="team-modern-status">Head of Projects Engineering</div>
                      <ul className="list-inline team-modern-social-list">
                        <li><a className="icon mdi mdi-facebook" href="#" /></li>
                        <li><a className="icon mdi mdi-twitter" href="#" /></li>
                        <li><a className="icon mdi mdi-instagram" href="#" /></li>
                        <li><a className="icon mdi mdi-google-plus" href="#" /></li>
                      </ul>
                    </div>
                  </article>
                  {/* Team Modern*/}
                  <article className="team-modern"><a className="team-modern-figure" href="#"><img src="images/team-20-270x236.jpg" alt width={270} height={236} /></a>
                    <div className="team-modern-caption">
                      <h6 className="team-modern-name"><a href="#">Ben Fitzgerald</a></h6>
                      <div className="team-modern-status">Engineer</div>
                      <ul className="list-inline team-modern-social-list">
                        <li><a className="icon mdi mdi-facebook" href="#" /></li>
                        <li><a className="icon mdi mdi-twitter" href="#" /></li>
                        <li><a className="icon mdi mdi-instagram" href="#" /></li>
                        <li><a className="icon mdi mdi-google-plus" href="#" /></li>
                      </ul>
                    </div>
                  </article>
                  {/* Team Modern*/}
                  <article className="team-modern"><a className="team-modern-figure" href="#"><img src="images/team-21-270x236.jpg" alt width={270} height={236} /></a>
                    <div className="team-modern-caption">
                      <h6 className="team-modern-name"><a href="#">John Tuff</a></h6>
                      <div className="team-modern-status">Top Manager</div>
                      <ul className="list-inline team-modern-social-list">
                        <li><a className="icon mdi mdi-facebook" href="#" /></li>
                        <li><a className="icon mdi mdi-twitter" href="#" /></li>
                        <li><a className="icon mdi mdi-instagram" href="#" /></li>
                        <li><a className="icon mdi mdi-google-plus" href="#" /></li>
                      </ul>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Subscribe to Our Newsletter*/}
        <section className="section parallax-container" data-parallax-img="images/bg-forms-1.jpg">
          <div className="parallax-content section-md context-dark text-md-start">
            <div className="container">
              <div className="row row-30 justify-content-center align-items-center">
                {/* <div className="col-lg-4 col-xl-3">
                  <h5 className="oh-desktop"><span className="d-inline-block wow slideInUp">Newsletter</span></h5>
                  <p className="oh-desktop"><span className="d-inline-block wow slideInDown">Sign up for our newsletter and follow us on social media</span></p>
                </div> */}
                {/* <div className="col-lg-8 col-xl-9">
                
                  <form className="rd-form rd-mailform rd-form-inline oh-desktop rd-form-inline-lg" data-form-output="form-output-global" data-form-type="subscribe" method="post" action="bat/rd-mailform.php">
                    <div className="form-wrap wow slideInUp">
                      <input className="form-input" id="subscribe-form-0-email" type="email" name="email" data-constraints="@Email @Required" />
                      <label className="form-label" htmlFor="subscribe-form-0-email">Your E-mail*</label>
                    </div>
                    <div className="form-button wow slideInRight">
                      <button className="button button-winona button-lg button-primary" type="submit">Subscribe</button>
                    </div>
                  </form>
                </div> */}
              </div>
            </div>
          </div>
        </section>
        {/* Latest news*/}
        <section className="section section-xl bg-default text-md-start">
          <div className="container">
            <div className="tabs-custom tabs-post" id="tabs-9">
              <div className="row align-items-md-end align-items-xl-start">
                <div className="col-md-6 tab-content-3 wow fadeInUp">
                  <div className="tab-content">
                    <div className="tab-pane fade show active" id="tabs-9-1">
                      <div className="post-amy-figure"><img src="images/mining/post-1-570x505.jpg" alt width={570} height={505} /><a href="blog-post.html"><span className="icon linearicons-link2" /></a>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="tabs-9-2">
                      <div className="post-amy-figure"><img src="images/mining/post-2-570x505.jpg" alt width={570} height={505} /><a href="blog-post.html"><span className="icon linearicons-link2" /></a>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="tabs-9-3">
                      <div className="post-amy-figure"><img src="images/mining/post-3-570x505.jpg" alt width={570} height={505} /><a href="blog-post.html"><span className="icon linearicons-link2" /></a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 index-1">
                  <h3 className="tabs-post-title oh-desktop"><span className="d-inline-block wow slideInDown">Dernières nouvelles</span></h3>
                  <ul className="nav nav-tabs">
                    <li className="nav-item wow fadeInRight" role="presentation"><a className="nav-link active" href="#tabs-9-1" data-bs-toggle="tab" />
                      <div className="post-amy">
                        <h5 className="post-amy-title"><a href="blog-post.html">Global Thermal Coal Market to Grow 5% in 2023</a></h5>
                        <ul className="post-amy-info list-inline">
                          <li className="post-amy-time"><span className="icon mdi mdi-clock" />
                            <time dateTime="2023-05-26">May 26, 2023</time>
                          </li>
                          <li className="post-amy-autor"><span className="icon mdi mdi-account-outline" /><a href="#">Jane Williams</a></li>
                        </ul>
                      </div>
                    </li>
                    <li className="nav-item wow fadeInRight" role="presentation"><a className="nav-link" href="#tabs-9-2" data-bs-toggle="tab" />
                      <div className="post-amy">
                        <h5 className="post-amy-title"><a href="blog-post.html">Mt Ridley Acquires Philippines Epithermal Gold Project</a></h5>
                        <ul className="post-amy-info list-inline">
                          <li className="post-amy-time"><span className="icon mdi mdi-clock" />
                            <time dateTime="2023-05-26">May 26, 2023</time>
                          </li>
                          <li className="post-amy-autor"><span className="icon mdi mdi-account-outline" /><a href="#">Jane Williams</a></li>
                        </ul>
                      </div>
                    </li>
                    <li className="nav-item wow fadeInRight" role="presentation"><a className="nav-link" href="#tabs-9-3" data-bs-toggle="tab" />
                      <div className="post-amy">
                        <h5 className="post-amy-title"><a href="blog-post.html">Mining-specific Staff Recruitment &amp; Management App Developed</a></h5>
                        <ul className="post-amy-info list-inline">
                          <li className="post-amy-time"><span className="icon mdi mdi-clock" />
                            <time dateTime="2023-05-26">May 26, 2023</time>
                          </li>
                          <li className="post-amy-autor"><span className="icon mdi mdi-account-outline" /><a href="#">Jane Williams</a></li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Page Footer*/}
        <footer className="section footer-classic context-dark footer-classic-2">
          <div className="footer-classic-content">
            <div className="container">
              <div className="row row-50 row-lg-0 g-0">
                <div className="col-sm-6 col-lg-4 wow fadeInRight" data-wow-delay="0s">
                  <div className="footer-classic-header">
                    <h6 className="footer-classic-title">Lien Rapide</h6>
                  </div>
                  <div className="footer-classic-body">
                    <ul className="footer-classic-list d-inline-block d-sm-block">
                      <li><a href="about-us.html">Our History</a></li>
                      <li><a href="#">FAQ</a></li>
                      <li><a href="grid-blog.html">Latest News</a></li>
                      <li><a href="#">Management</a></li>
                      <li><a href="projects.html">Projects</a></li>
                      <li><a href="contacts.html">Contact Us</a></li>
                    </ul>
                    <ul className="list-inline footer-social-list">
                      <li><a className="icon mdi mdi-facebook" href="#" /></li>
                      <li><a className="icon mdi mdi-twitter" href="#" /></li>
                      <li><a className="icon mdi mdi-instagram" href="#" /></li>
                      <li><a className="icon mdi mdi-google-plus" href="#" /></li>
                    </ul>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-4 wow fadeInRight" data-wow-delay=".1s">
                  <div className="footer-classic-header">
                    <div className="box-width-230">
                      <h6 className="footer-classic-title">Get in touch</h6>
                    </div>
                  </div>
                  <div className="footer-classic-body">
                    <div className="box-width-230">
                      <div className="footer-classic-contacts">
                        <div className="footer-classic-contacts-item">
                          <div className="unit unit-spacing-sm align-items-center">
                            <div className="unit-left"><span className="icon icon-24 mdi mdi-phone" /></div>
                            <div className="unit-body"><a className="phone" href="tel:#">+1 718-999-3939</a></div>
                          </div>
                        </div>
                        <div className="footer-classic-contacts-item">
                          <div className="unit unit-spacing-sm align-items-center">
                            <div className="unit-left"><span className="icon mdi mdi-email" /></div>
                            <div className="unit-body"><a className="mail" href="mailto:#">info@demolink.org</a></div>
                          </div>
                        </div>
                      </div><a className="button button-sm button-primary button-winona" href="contacts.html">Request a quote</a>
                    </div>
                  </div>
                </div>
                {/* <div className="col-lg-4 position-static">
                  <div className="footer-classic-gmap">
                    <div className="google-map-container" data-center="9870 St Vincent Place, Glasgow, DC 45 Fr 45." data-zoom={5} data-icon="images/gmap_marker.png" data-icon-active="images/gmap_marker_active.png" data-styles="[{&quot;featureType&quot;:&quot;water&quot;,&quot;elementType&quot;:&quot;geometry&quot;,&quot;stylers&quot;:[{&quot;color&quot;:&quot;#e9e9e9&quot;},{&quot;lightness&quot;:17}]},{&quot;featureType&quot;:&quot;landscape&quot;,&quot;elementType&quot;:&quot;geometry&quot;,&quot;stylers&quot;:[{&quot;color&quot;:&quot;#f5f5f5&quot;},{&quot;lightness&quot;:20}]},{&quot;featureType&quot;:&quot;road.highway&quot;,&quot;elementType&quot;:&quot;geometry.fill&quot;,&quot;stylers&quot;:[{&quot;color&quot;:&quot;#ffffff&quot;},{&quot;lightness&quot;:17}]},{&quot;featureType&quot;:&quot;road.highway&quot;,&quot;elementType&quot;:&quot;geometry.stroke&quot;,&quot;stylers&quot;:[{&quot;color&quot;:&quot;#ffffff&quot;},{&quot;lightness&quot;:29},{&quot;weight&quot;:0.2}]},{&quot;featureType&quot;:&quot;road.arterial&quot;,&quot;elementType&quot;:&quot;geometry&quot;,&quot;stylers&quot;:[{&quot;color&quot;:&quot;#ffffff&quot;},{&quot;lightness&quot;:18}]},{&quot;featureType&quot;:&quot;road.local&quot;,&quot;elementType&quot;:&quot;geometry&quot;,&quot;stylers&quot;:[{&quot;color&quot;:&quot;#ffffff&quot;},{&quot;lightness&quot;:16}]},{&quot;featureType&quot;:&quot;poi&quot;,&quot;elementType&quot;:&quot;geometry&quot;,&quot;stylers&quot;:[{&quot;color&quot;:&quot;#f5f5f5&quot;},{&quot;lightness&quot;:21}]},{&quot;featureType&quot;:&quot;poi.park&quot;,&quot;elementType&quot;:&quot;geometry&quot;,&quot;stylers&quot;:[{&quot;color&quot;:&quot;#dedede&quot;},{&quot;lightness&quot;:21}]},{&quot;elementType&quot;:&quot;labels.text.stroke&quot;,&quot;stylers&quot;:[{&quot;visibility&quot;:&quot;on&quot;},{&quot;color&quot;:&quot;#ffffff&quot;},{&quot;lightness&quot;:16}]},{&quot;elementType&quot;:&quot;labels.text.fill&quot;,&quot;stylers&quot;:[{&quot;saturation&quot;:36},{&quot;color&quot;:&quot;#333333&quot;},{&quot;lightness&quot;:40}]},{&quot;elementType&quot;:&quot;labels.icon&quot;,&quot;stylers&quot;:[{&quot;visibility&quot;:&quot;off&quot;}]},{&quot;featureType&quot;:&quot;transit&quot;,&quot;elementType&quot;:&quot;geometry&quot;,&quot;stylers&quot;:[{&quot;color&quot;:&quot;#f2f2f2&quot;},{&quot;lightness&quot;:19}]},{&quot;featureType&quot;:&quot;administrative&quot;,&quot;elementType&quot;:&quot;geometry.fill&quot;,&quot;stylers&quot;:[{&quot;color&quot;:&quot;#fefefe&quot;},{&quot;lightness&quot;:20}]},{&quot;featureType&quot;:&quot;administrative&quot;,&quot;elementType&quot;:&quot;geometry.stroke&quot;,&quot;stylers&quot;:[{&quot;color&quot;:&quot;#fefefe&quot;},{&quot;lightness&quot;:17},{&quot;weight&quot;:1.2}]}]">
                      <div className="google-map" />
                      <ul className="google-map-markers">
                        <li data-location="9870 St Vincent Place, Glasgow, DC 45 Fr 45." data-description="9870 St Vincent Place, Glasgow" />
                      </ul>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="footer-classic-panel">
            <div className="container">
              {/* Rights*/}
              <p className="rights"><span>©&nbsp;</span><span className="copyright-year" /><span>&nbsp;</span><span>Mine First</span><span>.&nbsp;</span><a href="privacy-policy.html">Politique de confidentialité</a></p>
            </div>
          </div>
        </footer>
      </div>
    </div>

  )
}

export default App
