var media = ['華視新聞', '中央通訊社', '聯合報', '三立新聞']
var mediaEN = ['cts', 'cna', 'udn', 'setn']
var smallDesktopWidthSize = 1000
var mediaColor = {
  '華視新聞': '#F8BBD0',
  '中央通訊社': '#96E7F2',
  '聯合報': '#00BCD4',
  '三立新聞': '#0B4F7C',
}

var mediaEN2C={cts:"華視新聞",cna:"中央通訊社",udn:"聯合報",setn:"三立新聞"};

function mediaNameTranslate(mediaName) {
  var dict = {
    'udn': '聯合報',
    'cna': '中央通訊社',
    'cts': '華視新聞',
    'setn': '三立新聞',
    '聯合報': 'udn',
    '中央通訊社': 'cna',
    '華視新聞': 'cts',
    '三立新聞': 'setn'
  }
  return dict[mediaName]
}