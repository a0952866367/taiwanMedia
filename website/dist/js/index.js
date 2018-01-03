$('.menu').on('click', function() {
  if ($('.container').hasClass('is-open')) {
    $('.menu').removeClass('is-active');
    $('.container').removeClass('is-open');
  } else {
    $('.menu').addClass('is-active');
    $('.container').addClass('is-open');
  }
});

$(window).on('scroll', function(event) {
  var pos = $('body').scrollTop() + 100
  if (pos-50 > $('#cloud').offset().top) {
    $('.legend-container').removeClass('hidden');
  } else {
    $('.legend-container').addClass('hidden');
  }
  if (pos >= $('#discussion').offset().top) {
    $('.nav a').removeClass('nav-primary')
    $('#button3').addClass('nav-primary');
  } else if (pos >= $('#report').offset().top) {
    $('.nav a').removeClass('nav-primary')
    $('#button2').addClass('nav-primary');
  } else {
    $('.nav a').removeClass('nav-primary')
    $('#button1').addClass('nav-primary');
  }
  // if (pos >= $('#timeline').offset().top){
  //   $('.card-container').addClass('show')
  // }
})

$('.nav li').on('click', function(event) {

  if (event.target.id === 'button1') {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    $('.nav a').removeClass('nav-primary')
    $('#button1').addClass('nav-primary');
  } else if (event.target.id === 'button2') {
    var offset = $('#report').offset();
    $('body,html').animate({ scrollTop: offset.top - 50 }, 'slow');
    $('.nav a').removeClass('nav-primary')
    $('#button2').addClass('nav-primary');
  } else if (event.target.id === 'button3') {
    var offset = $('#discussion').offset();
    $('body,html').animate({ scrollTop: offset.top - 50 }, 'slow');
    $('.nav a').removeClass('nav-primary')
    $('#button3').addClass('nav-primary');
  }
});

var report
$.get('report_m.json', function(t) {
  report = t;
  var totoalNews = 0;

  for (var i=0 ; i<4 ; i++ ) {
    totoalNews += report[i].news_count;
  }
  $('#num-news').text(totoalNews);

  var barData = [];
  for (var item in media) {
    barData.push({
      title: media[item],
      newsCount: report[item].news_count
    });
  }
  setTimeout(function() {
    window.createNewsBarChart('#num-news-bar', barData);
  }, 1000);

  var bubbleData = [];
  for (var item in media){
    var category_length = Object.keys(report[item].category).length
    for ( var i=0 ; i<category_length ; i++ ){
      bubbleData.push({
        category: Object.keys(report[item].category)[i],
        size: Object.values(report[item].category)[i],
        media_name: report[item].website
      })
    }
  }
  setTimeout(function() {
    window.createNewBubbleChart('#field-bubble', bubbleData);
  }, 100);
  

  for (var item in mediaEN) {
    window.addVisWord(mediaEN[item], report[item].average_word);
  }
});