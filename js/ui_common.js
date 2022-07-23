window.onload = function(){
    const html = document.querySelector('html');
    /* resize */
    const delay = 300;
    let timer = null;
    let browserWidth = 0;
    window.addEventListener('resize', function(){
        clearTimeout(timer);
        timer = setTimeout(function(){
            browserWidth = window.innerWidth;
            console.log(browserWidth);
        }, delay);
    });

    //device check
    function deviceChk (){
        if(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){  //ipad는 pc로 보이게 한다.
            html.classList.add('m_plus');
        }else{
            html.classList.add('pc_plus');
        }
    }
    deviceChk();

    /* landscape check */
    if (window.matchMedia('(orientation: portrait)').matches) {
        html.classList.add('Portrait');
    } else {
        html.classList.add('Landscape');
    }
    
    /* header fix */
    const header = document.querySelector('#header');
    window.addEventListener('scroll', function(){
        const top = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        (top > 100) ? header.classList.add('fixed') : header.classList.remove('fixed');
    });
    
    /* nav toggle */
    function navToggle (){
        const body = document.querySelector('body');
        const navWrap = document.querySelector('.nav_wrap');
        const nav = document.querySelector('.btn_nav');
        const navToggle = document.querySelector('.nav_wrap, .btn_nav');
        const btnClose = document.querySelector('.nav_wrap .btn_close');
        nav.addEventListener('click', function() {
            // let _title = $('> a', this).attr('title');
            let _title = $(this).attr('title');
            $(".btn_close").attr('title','열기') // 2022-07-21
            navWrap.classList.toggle('open');
            $('body').css('overflow', 'hidden');
        });
        btnClose.addEventListener('click', function() {
            $(".btn_close").attr('title','닫기') // 2022-07-21
            $('body').css('overflow', 'unset');
            navWrap.classList.remove('open')
        });
    }
    navToggle();

    /* 메뉴 > 상품소개 */
    function produceProduct (){
        $('.product_introduce').on('click', function(e){
            e.preventDefault;
            $(this).toggleClass('toggle');
        })
    }
    produceProduct ();

    /* 메뉴 > 광고 */
    var navAd = new Swiper(".ad_wrap", {
        slideToClickedSlide: true,
        grabCursor: true,
        pauseOnMouseEnter:true,
    });

    /* 레이어팝업 */
    $('body').append('<div class="dim"></div>');
    $('.btn_layer_close, .button_wrap button, .dim').on('click', function(){
        $('.layer, .dim').remove();
    });
    
    var controlLayer = function(layerId, val) {
        if (val == 1) {
            function init() {
                $('.layer_content').animate({scrollTop : 0}, 400);
                $('html, body').css('overflow','hidden');
                $(layerId).find('.btn_layer_close').blur();
                if ($(layerId).height() >= $(window).height()) {
                    size();
                } else {
                    $(layerId).find('.layer_con').css('height','inherit');
                }
                $('.layer_content').attr('tabindex','0'); /* 20220617 */
                $('.nofocus').attr('tabindex','-1');
                /* 20220627 웹접근성 */
                var hTags = '';
                $(layerId).find("ul.tab_nav, ul.tab > li").each(function() {
                    var hTag = '<h3 class="hidden">';
                    var aText = $(this).find('a').text();
                    hTag += aText;
                    hTag += '</h3>';
                    hTags += hTag;
                });
                $(layerId).find("ul.tab_nav, ul.tab").after(hTags);

                if (!$(layerId).find("ul.tab_nav, ul.tab > li").hasClass('active')) {
                    $(layerId).find("ul.tab_nav, ul.tab > li").first().addClass("active");
                    $(layerId).find("ul.tab_nav, ul.tab > li.active > a").attr("title", "선택됨");
                    // $(layerId).find(".tab_cont").hide().attr('tabindex','-1');
                    // $(layerId).find(".tab_cont:first").show().attr('tabindex','0');
                    //$(this).closest('.tab_wrap').find('> h3').first();
                }
                /* //20220627 웹접근성 */
            }
            init();

            function dim() {
                $('.dim').css({
                    'width': $('html, body').width(),
                    'height': $(document).height()
                }).show();
            }
            dim();

            function layer() {
                $(layerId).css({
                    'top': ($(window).height() / 2) - ($(layerId).height() / 2),
                    'left': ($(window).width() - $(layerId).width()) / 2
                });
            }
            layer();

            function show() {
                $(layerId).show().attr('tabindex', 0).focus();
            }
            show();

            function size() {
                $(layerId).find('.layer_con').css({
                    'height': $(window).height() - 160,
                    'overflow-y': 'auto'
                });
            }

            $(window).resize(function() {
                size();
                layer();
                $('.dim').css({
                    'width': $('html, body').width(),
                    'height': $(document).height()
                });
            });

            /* 20220629 웹접근성 */
            let tabOnIndex2 = $(layerId).find('div.layer_content > ul.tab_nav, ul.tab > li.active').index();
            $(layerId).find('div.layer_content > ul.tab_nav, ul.tab > li.active').parents('ul').siblings('h3').eq(0).attr("title", "선택됨");
            $(layerId).find('div.layer_content > ul.tab_nav, ul.tab > li > a').on('click', function(event){
                let _currentIndex2 = $(this).closest('li').index();
                let _title2 = $(this).parents('ul').siblings('h3');
                $(this).attr("title", "선택됨").closest('li').addClass('active').siblings('li').removeClass('active').find('> a').attr("title", "");
                _title2.attr("title", "");
                _title2.eq(_currentIndex2).attr("title", "선택됨");

                var currentTab = $(this).attr('href');
                if(document.getElementById(currentTab.replace(/#/gi,'')) != null) {
                    $(this).parents('.layer_content').children('.tab_cont').hide().attr('tabindex','-1');
                    $(currentTab).show().attr('tabindex','0');
                }
            });
            /* 20220629 웹접근성 */
        } else {
            $(layerId).removeAttr('style');
            $(layerId).find('.layer_con').removeAttr('style');
            $(layerId).removeAttr('tabindex').hide();

            var dim = 0

            if ($(layerId).attr('tabindex') == 0) {
                dim += 1;
            }

            if (dim == 0) {
                $('.dim').hide();
                $('html, body').css('overflow','visible');
            }

            $(layerId).hide();

            // 닫기 후 버튼 포커스
            var $layerBtn = $(layerId).attr('id');
            $('.layer_focus[date-id="'+$layerBtn+'"]').focus();
            $('.item_order .layer_focus').parent('.item_order').css({opacity:1});
        }
    }
    /* //레이어팝업 */

    /* 메인 - 탑 비주얼 */
	var mainTopVisual = new Swiper(".visual_wrap.swiper", {
        slideToClickedSlide: true,
        //pauseOnMouseEnter:true,
        // grabCursor: true, // 2022-07-13
        pagination: {
			el: ".swiper-pagination",
			type: "fraction",
		},
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
        autoplay: { // 2022-07-13
            delay: 3000,
            disableOnInteraction: true
        },
        loop:true, // 2022-07-13
        a11y: { // 2022-07-13
            prevSlideMessage: '이전',
            nextSlideMessage: '다음',
            slideLabelMessage: '총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.'
        },
	});
    
     // 2022-07-13
     $(".visual_wrap").find(".autoplay-control").keyup(function(e){
        var keyCode = e.keyCode || e.which
        if(keyCode == 9){
            $(".autoplay-control").addClass("playshow")
            mainTopVisual.autoplay.stop()
            $(this).children("button").attr("aria-pressed",true)     
        }
    })

    $(".autoplay-control").on("click",function(){
        if($(".visual_wrap").find(".autoplay-control").hasClass("playshow")){
            $(".autoplay-control").removeClass("playshow")
            mainTopVisual.autoplay.start()
            $(this).children("button").attr("aria-pressed",false)        
        } else {
            $(".autoplay-control").addClass("playshow")
            mainTopVisual.autoplay.stop()
            $(this).children("button").attr("aria-pressed",true)            
        }
    })

    /* 메인 - 상품 */
    var mainProduct = new Swiper(".product_wrap.swiper", {
        slidesPerView: 1.3,
        spaceBetween: 0,
        slideToClickedSlide: true,
        grabCursor: true,
        pauseOnMouseEnter:true,
        breakpoints: {
            1180: {
              slidesPerView: 'auto',
              touchRatio:0,
            },
        }
    });

    // 2022-07-13
    $(".product_wrap").find(".swiper-slide").each(function(){
        $(this).keyup(function(e){
            var keyCode = e.keyCode || e.which
            if(keyCode == 9) {
                $(this).find(".visual_img").addClass("on")
                $(".product_wrap").find(".swiper-slide").not(this).find(".visual_img").removeClass("on")
            }
        })
    })

	/* 메인 - 혜택소개 */
    var benefitTitSwiper = new Swiper(".benefit_wrap .swiper_tit", {
        spaceBetween: 0,
        slidesPerView: 'auto',
        grabCursor: true,
        // touchRatio: 0.2,
        // slidesPerGroupAuto: false,
        // watchSlidesProgress: true,
        slideToClickedSlide: true,
        // watchOverflow: true,
        // freeMode: true,
				on: {
					slideChange: function(){
						swiperEvent(this.realIndex);
					}
				}
    });
    var benefitConSwiper = new Swiper(".benefit_wrap .swiper_con", {
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          pauseOnMouseEnter:true,
        },
        navigation: { // 2022-07-13
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        slidesPerView:'auto', // 2022-07-13
        loop:false, // 2022-07-13
				on: {
					slideChange: function(){
						swiperEvent(this.realIndex);
					}
				}
    });
    
    /* 구독신청 > 약관 동의 : 전체동의,해제 */
    function checkAll (){
        $(".lst_agree .input_wrap:nth-child(1)").click(function() {
            //$(this).siblings('.input_wrap').find("input:checkbox").prop("checked", "checked");
            if($(this).find('input').prop('checked')){
                $(this).siblings('.input_wrap').find("input").prop("checked",true);
            }else{
                $(this).siblings('.input_wrap').find("input").prop("checked",false);
            }
        });
    }
    checkAll ();
    function checkLength (){
        $(".lst_agree .input_wrap input").change(function(){
            let agreeLength = $(".lst_agree .input_wrap");
            if(agreeLength.length-1 == agreeLength.find('input').filter(":checked").length){
                $(".lst_agree .input_wrap:nth-child(1) input").prop("checked", "checked")
            }
        })
    }
    checkLength();

    // 2022-07-13
    var total = $(".benefit_wrap").find(".swiper_tit").find(".swiper-slide").length
    $(".benefit_wrap").find(".swiper-slide").each(function(index){
        $(this).keyup(function(e){
            var keyCode = e.keyCode || e.which
            if(keyCode == 9){
                $(this).addClass('active')
                $(".benefit_wrap").find(".swiper-slide").not(this).removeClass("active")
            }
            if(keyCode == 13){
//  console.log(`123123123`)
                swiper.slideTo(index, 1000, false)
            }
            // swiper.slideTo(index, 1000, false)
        })
    })

    $(".benefit_wrap").find(".swiper-button-next, .swiper-button-prev").keyup(function(e){
        var keycode = e.keycode || e.which
        if(keycode == 13) {
            console.log(`4번째섹션으로 넘어가야함`)
            // anchor가 fourthPage로 변경되어야함 -> 미정
            // 2022-07-15금요일::접근성연구소에서 전화문의하여 스페이스바로 컨트롤해도 된다고는 전달받았음
            // 현재는 스페이스바로 컨트롤시 foruthPage로 변경됨
            $('#fullpage').fullpage({
                anchors:['fourthPage']
            })
        }
    });

    var _target         = $('.main .swiper_tit');
    var _targetList     = _target.find('> div > div');
    var _selectedIdx    = 0;

    if(_target.length){
			// 최초 로드 시 탭 타이틀 0번째에 class 활성화
			swiperEvent(_selectedIdx);
			
			// // 스와이퍼 인덱스 체크
			// benefitTitSwiper.on('slideChange', function () {
			// 		_selectedIdx = benefitTitSwiper.realIndex;
			// 		swiperEvent(_selectedIdx);    
			// });
			// benefitConSwiper.on('slideChange', function () {
			// 		_selectedIdx = benefitConSwiper.realIndex;
			// 		swiperEvent(_selectedIdx);    
			// });
			
			// 탭 타이틀 인덱스 체크
			_targetList.on('click', function(e){
					_selectedIdx = $(e.target).closest('div').index();
					swiperEvent(_selectedIdx);
			});
			
			// 인덱스를 받아서 실행하는 함수를 스와이퍼, 탭 타이틀 양쪽에 사용
			function swiperEvent(index){
					// var _posCenter      = window.outerWidth / 2;
					// var _pos            = 0;
					// var _calcPosValue   = 0;
			
					// 인덱스에 맞는 탭 타이틀 class 활성화
					$(_targetList[index]).addClass('active').siblings('div').removeClass('active'); 
					
					// 선택된 탭 타이틀이 화면 중앙에 위치했을때의 값
					//_calcPosValue = _targetList[index].offsetLeft + _targetList[index].offsetWidth / 2;

					//console.log( _targetList[index].offsetLeft, _targetList[index].offsetWidth );
					
					// // 디바이스의 중간 위치 값보다 작으면 동작 하지 않음
					// if( _calcPosValue <= _posCenter ){
					// 		_pos = 0;
					// } else {
					// // 디바이스의 중간 위치 값보다 크면 이동
					// 		_pos = _calcPosValue - _posCenter;
					// }

					// 23.5 / 142.775
					//$('.swiper_tit').animate( { scrollLeft: _pos }, 300);

					//$('.swiper-wrapper').css("transform", `translate3d(${_pos}, 0, 0)`);
					benefitTitSwiper.slideTo(index);
					benefitConSwiper.slideTo(index);
			}

			const benefit = document.querySelector('.benefit_wrap');
			const btnBenefit = document.querySelector('.benefit_wrap button');
			btnBenefit.addEventListener('click', function(e){
					benefit.classList.toggle('toggle');
					//e.classList.contains('toggle') ? el.classList.remove('toggle') : el.classList.add('toggle');
			});
		}
}

$(document).ready(function() {
    /* jqeury.fullpage.js */
    $('#fullpage').fullpage({
        //이동
        menu: '#menu',
        anchors:['firstPage', 'secondPage', 'thirdPage', 'fourthPage'], // 2022-07-13
        lockAnchors: false,
        navigation: true,
        navigationPosition: 'right',
        navigationTooltips: ['firstSlide', 'secondSlide', 'thirdSlide', 'foruthSlide'], // 2022-07-13
        showActiveTooltip: false,
        slidesNavigation: false,
        slidesNavPosition: 'bottom',

        //스크롤
        css3: true,
        scrollingSpeed: 800,
        autoScrolling: true,
        fitToSection: true,
        fitToSectionDelay: 1000,
        scrollBar: false,
        easing: 'easeInOutCubic',
        easingcss3: 'ease',
        loopBottom: false,
        loopTop: false,
        loopHorizontal: true,
        continuousVertical: false,
        continuousHorizontal: false,
        scrollHorizontally: false,
        interlockedSlides: false,
        dragAndMove: false,
        offsetSections: false,
        resetSliders: false,
        fadingEffect: false,
        normalScrollElements: '#element1, .element2',
        scrollOverflow: false,
        scrollOverflowReset: false,
        scrollOverflowOptions: null,
        touchSensitivity: 15,
        bigSectionsDestination: null,

        //접근성
        keyboardScrolling: true,
        animateAnchor: true,
        recordHistory: true,

        //디자인
        controlArrows: true,
        verticalCentered: true,
        responsiveWidth: 1181,
        responsiveHeight: 0,
        responsiveSlides: false,
        parallax: false,
        parallaxOptions: {type: 'reveal', percentage: 62, property: 'translate'},
        cards: false,
        cardsOptions: {perspective: 100, fadeContent: true, fadeBackground: true},
        //맞춤 선택자
        sectionSelector: '.section',
        slideSelector: '.slide',

        lazyLoading: true,

        //사건(이벤트)
        onLeave: function(origin, destination, direction){},
        afterLoad: function(origin, destination, direction){},
        afterRender: function(){},
        afterResize: function(width, height){},
        afterReBuild: function(){},
        afterResponsive: function(isResponsive){},
        afterSlideLoad: function(section, origin, destination, direction){},
        onSlideLeave: function(section, origin, destination, direction){}
    });
    /* //jqeury.fullpage.js */
    // 2022-07-13
    var screenwidth = document.body.offsetWidth // 2022-07-19
    $(".product_wrap").find(".swiper-slide").each(function(){
        $(this).hover(function(){
            $(this).find(".visual_img").addClass("on")
            $(".product_wrap").find(".swiper-slide").not(this).children(".visual_img").removeClass("on")
        })
        // 2022-07-19
        $(this).index() == 3 && screenwidth <= 1450 ? $(this).find(".product_tit").children("p").css({
            "max-width":"59%",
            "word-break":"keep-all"
        }) : null
    })

    // 2022-07-19
    screenwidth <= 1450 ? $(".benefit_wrap").find(".swiper_tit").css("margin-bottom","10px") : null
    screenwidth <= 1450 ? $(".benefit_wrap").find(".swiper-slide").css("font-size","0.945rem") : null 
    // 2022-07-20
    screenwidth <= 1450 ? $(".benefit_wrap").find(".swiper-button-prev, .swiper-button-next").css("top","53vh") : null
    screenwidth <= 1450 ? $(".benefit_wrap").find(".benefit_info").children(".txt3").css("max-width","490px") : null

    /* 구독신청 > 선택 */
    $('.box_wrap .box_con').on('click', function(e){
        e.preventDefault();
        $(this).siblings('.box_con').removeClass('on');
        $(this).addClass('on');
    })

    // 2022-07-21, 2022022개발로 이관
    /*
    $(".benefitMenu").on("click",function(e){
        $(".nav_wrap").removeClass("open")
        var anchor = $(this).attr("data-link");
        e.preventDefault()
        $.fn.fullpage.moveTo(anchor,3)
    })
    */
});