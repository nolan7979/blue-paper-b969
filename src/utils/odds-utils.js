{
  /* 
<ul id="ddlOddsType" style="">
  <li onclick="changeTopOddsType(4)" id="oddsType_4">TL thập phân</li>
  <li onclick="changeTopOddsType(1)" id="oddsType_1">TL Hong Kong </li>
  <li onclick="changeTopOddsType(2)" id="oddsType_2">TL Indo</li>
  <li onclick="changeTopOddsType(3)" id="oddsType_3">TL Mỹ</li>
  <li onclick="changeTopOddsType(5)" id="oddsType_5">TL Malay</li>
</ul> 
*/
}

var LQHANDICAP,
  headtime,
  timeZone,
  startani_C,
  startani_A,
  startani_B,
  pop_TC,
  oPopup,
  goal,
  goalTime,
  zXml,
  X2,
  _cnzzLoaded,
  _cnzzUrls,
  dark_mode,
  bomHelper,
  ssoAvataUrl,
  _share,
  soccerInPage,
  basketInPage,
  _counFavMatchTimmer,
  Storage,
  _oddsType,
  _timeZone,
  wsUtil;

function changeTopOddsType(n) {
  if (_oddsType != n) {
    document.getElementById('selectedOddsType').innerText =
      document.getElementById('oddsType_' + n).innerText;

    _oddsType = parseInt(n);

    SetOddType(n);

    changeOddsType();
  }
}

function SetOddType(n) {
  writeShareCookie('Odds_Type', n);
}

function writeShareCookie(n, t, i) {
  var r = i;
  r == undefined && (r = new Date(new Date().getTime() + 1314e6));
  r = ';path=/;expires=' + r.toGMTString() + ';domain=' + getDoMain();
  document.cookie = n + '=' + escape(t) + r;
}

function getDoMain() {
  var n = location.href.split('/')[2].split('.');
  return /^\d+$/.test(n[1])
    ? n[0] + '.' + n[1] + '.' + n[2] + '.' + n[3].split(':')[0]
    : n[1] + '.' + n[2];
}

function changeOddsType() {
  for (
    var n, i, u, r = document.getElementsByName('oddsData'), t = 0;
    t < r.length;
    t++
  )
    ((n = r[t]), (i = n.getAttribute('data-o')), i) &&
      ((u = n.getAttribute('data-e') == !0),
      (n.innerText = oTool.changePL(_oddsType, i, u)));
}

var FloatHelper = {
  DecimalLength: function (n) {
    var t = n.toString().split(/[eE]/),
      i = (t[0].split('.')[1] || '').length - Number(t[1] || 0);
    return i > 0 ? i : 0;
  },
  Operator: function (n, t, i) {
    var f = this.DecimalLength(n),
      e = this.DecimalLength(t),
      u = Math.max(f, e),
      r = Math.pow(10, u);

    var rv = 0;
    switch (i) {
      case '*':
      case 2:
        u = f + e;
        rv = (n * Math.pow(10, f) * t * Math.pow(10, e)) / Math.pow(10, u);
        break;
      case '/':
      case 3:
        u < 3 && (u = 3);
        rv = (n * r) / (t * r);
        break;
      case '%':
      case 4:
        rv = ((n * r) % (t * r)) / r;
        break;
      case '-':
      case 1:
        rv = (n * r - t * r) / r;
        break;
      default:
        rv = (n * r + t * r) / r;
    }
    return parseFloat(rv.toFixed(u));
  },
};

export const oTool = {
  USJson: {
    0.22: -450,
    0.28: -350,
    0.33: -300,
    0.36: -275,
    0.38: -267,
    0.44: -225,
    0.47: -212.5,
    0.53: -187.5,
    0.57: -175,
    0.62: -162.5,
    0.63: -160,
    0.66: -150,
    0.72: -137.5,
    0.83: -120,
    0.88: -114,
    0.91: -110,
    0.95: -105,
  },
  fractionJson: {
    0.22: '2/9',
    0.28: '2/7',
    0.33: '1/3',
    0.36: '4/11',
    0.38: '3/8',
    0.44: '4/9',
    0.47: '40/85',
    0.53: '8/15',
    0.57: '4/7',
    0.62: '8/13',
    0.63: '5/8',
    0.66: '4/6',
    0.72: '8/11',
    0.83: '5/6',
    0.88: '7/8',
    0.91: '10/11',
    0.95: '20/21',
  },
  getPL: function (n, t, i, r, u) {
    if (u && n != 3 && n != '3' && n != 6 && n != '6') {
      return [this.toFixZero(t), this.toFixZero(i), this.toFixZero(r)];
    }

    switch (n) {
      case 1:
      case '1':
        return [t, i, r];
      case 2:
      case '2':
        return u ? [t, i, r] : [this.toIN(t), i, this.toIN(r)];
      case 3:
      case '3':
        return u
          ? [this.toUSEu(t), this.toUSEu(i), this.toUSEu(r)]
          : [this.toUS(t), i, this.toUS(r)];
      case 4:
      case '4':
        return [this.toEU(t), i, this.toEU(r)];
      case 5:
      case '5':
        return u ? [t, i, r] : [this.toML(t), i, this.toML(r)];
      case 6:
      case '6':
        return u
          ? [this.toFractionEu(t), this.toFractionEu(i), this.toFractionEu(r)]
          : [this.toFraction(t), i, this.toFraction(r)];
    }
  },
  changePL: function (n, t, i) {
    if (!parseFloat(t)) return t;

    if (i && n != 3 && n != '3' && n != 6 && n != '6') {
      return this.toFixZero(t);
    }

    switch (n) {
      case 1:
      case '1':
        return this.toFixZero(t);
      case 2:
      case '2':
        return this.toIN(t);
      case 3:
      case '3':
        return i ? this.toUSEu(t) : this.toUS(t);
      case 4:
      case '4':
        return this.toEU(t);
      case 5:
      case '5':
        return this.toML(t);
      case 6:
      case '6':
        return i ? this.toFractionEu(t) : this.toFraction(t);
    }

    // console.log('miss:', n, t, i);
    return t;
  },
  toIN: function (n) {
    if (!n) return '';
    var t = parseFloat(n),
      i = this.countDecimal(t) > 2 ? 3 : 2;
    return t < 1 ? (0 - 1 / t).toFixed(i) : this.toFixZero(n);
  },
  toML: function (n) {
    if (!n) return '';
    var t = parseFloat(n),
      i = this.countDecimal(t) > 2 ? 3 : 2;
    return t > 1 ? (0 - 1 / t).toFixed(i) : this.toFixZero(n);
  },
  toEU: function (n) {
    if (!n) return '';
    var t = parseFloat(n),
      i = this.countDecimal(t) > 2 ? 3 : 2;
    return (t + 1).toFixed(i);
  },
  toUS: function (n) {
    if (!n) return '';
    var t = parseFloat(n),
      r = this.countDecimal(t) > 2 ? 3 : 2,
      i = oTool.USJson;
    return t in i
      ? i[t]
      : t <= 0
      ? 0
      : t < 1
      ? Math.round(0 - 100 * (1 / t).toFixed(r))
      : Math.round(100 * t);
  },
  toUSEu: function (n) {
    var t, r, i;
    return n
      ? ((t = parseFloat(n)),
        (r = this.countDecimal(t) > 2 ? 3 : 2),
        !t || isNaN(t))
        ? ''
        : ((t = FloatHelper.Operator(t, 1, '-')), (i = oTool.USJson), t in i)
        ? i[t]
        : t == 0
        ? '0'
        : t < 1
        ? Math.round(0 - 100 * (1 / t).toFixed(r))
        : Math.round(100 * t)
      : '';
  },
  toFraction: function (n) {
    var t = parseFloat(n),
      r,
      i,
      u,
      f,
      e;
    if (t.toString() == 'NaN') return '';
    if (
      ((r = t < 0),
      r && (t = Math.abs(t)),
      (i = {
        n: 0,
        m: 1,
      }),
      (u = 0),
      t > 1 && (t = FloatHelper.Operator(t, (u = t | 0), '-')),
      (f = oTool.fractionJson),
      t in f)
    )
      (e = f[t].split('/')), (i.n = parseInt(e[0])), (i.m = parseInt(e[1]));
    else if (t > 0) {
      var s = function (n, t) {
          return t == 0 ? n : s(t, n % t);
        },
        o = Math.pow(10, FloatHelper.DecimalLength(t)),
        h = parseInt(t * o),
        c = s(o, h);
      i.n = h / c;
      i.m = o / c;
    }
    return (r ? '-' : '') + (u * i.m + i.n) + '/' + i.m;
  },
  toFractionEu: function (n) {
    var t = parseFloat(n),
      r,
      i,
      u,
      f,
      e;
    if (t.toString() == 'NaN') return '';
    if (
      ((t = FloatHelper.Operator(t, 1, '-')),
      (r = t < 0),
      r && (t = Math.abs(t)),
      (i = {
        n: 0,
        m: 1,
      }),
      (u = 0),
      t > 1 && (t = FloatHelper.Operator(t, (u = t | 0), '-')),
      (f = oTool.fractionJson),
      t in f)
    )
      (e = f[t].split('/')), (i.n = parseInt(e[0])), (i.m = parseInt(e[1]));
    else if (t > 0) {
      var s = function (n, t) {
          return t == 0 ? n : s(t, n % t);
        },
        o = Math.pow(10, FloatHelper.DecimalLength(t)),
        h = parseInt(t * o),
        c = s(o, h);
      i.n = h / c;
      i.m = o / c;
    }
    return (r ? '-' : '') + (u * i.m + i.n) + '/' + i.m;
  },
  toFixZero: function (n, t) {
    t || (t = this.countDecimal(n) > 2 ? 3 : 2);
    var i = parseFloat(n);
    return i.toString() == 'NaN' ? n : i.toFixed(t);
  },
  countDecimal: function (n) {
    var t = ('' + n).match(/\.(\d+)$/);
    return t === null ? 0 : t[1].length;
  },
};

const _handicapTypeArray = ['/-', '+/-', '/*', '让/受让'],
  _handicapType = 1,
  _handicapAccept = '-',
  _handicapGive = '',
  _ouTrimEndZero = !0,
  GoalCn = [
    '0',
    '0/{0}0.5',
    '{0}0.5',
    '{0}0.5/1',
    '{0}1',
    '{0}1/1.5',
    '{0}1.5',
    '{0}1.5/2',
    '{0}2',
    '{0}2/2.5',
    '{0}2.5',
    '{0}2.5/3',
    '{0}3',
    '{0}3/3.5',
    '{0}3.5',
    '{0}3.5/4',
    '{0}4',
    '{0}4/4.5',
    '{0}4.5',
    '{0}4.5/5',
    '{0}5',
    '{0}5/5.5',
    '{0}5.5',
    '{0}5.5/6',
    '{0}6',
    '{0}6/6.5',
    '{0}6.5',
    '{0}6.5/7',
    '{0}7',
    '{0}7/7.5',
    '{0}7.5',
    '{0}7.5/8',
    '{0}8',
    '{0}8/8.5',
    '{0}8.5',
    '{0}8.5/9',
    '{0}9',
    '{0}9/9.5',
    '{0}9.5',
    '{0}9.5/10',
    '{0}10',
    '{0}10/10.5',
    '{0}10.5',
    '{0}10.5/11',
    '{0}11',
    '{0}11/11.5',
    '{0}11.5',
    '{0}11.5/12',
    '{0}12',
    '{0}12/12.5',
    '{0}12.5',
    '{0}12.5/13',
    '{0}13',
    '{0}13/13.5',
    '{0}13.5',
    '{0}13.5/14',
    '{0}14',
  ],
  GoalCnOU = [
    '0',
    '0/0.5',
    '0.5',
    '0.5/1',
    '1',
    '1/1.5',
    '1.5',
    '1.5/2',
    '2',
    '2/2.5',
    '2.5',
    '2.5/3',
    '3',
    '3/3.5',
    '3.5',
    '3.5/4',
    '4',
    '4/4.5',
    '4.5',
    '4.5/5',
    '5',
    '5/5.5',
    '5.5',
    '5.5/6',
    '6',
    '6/6.5',
    '6.5',
    '6.5/7',
    '7',
    '7/7.5',
    '7.5',
    '7.5/8',
    '8',
    '8/8.5',
    '8.5',
    '8.5/9',
    '9',
    '9/9.5',
    '9.5',
    '9.5/10',
    '10',
    '10/10.5',
    '10.5',
    '10.5/11',
    '11',
    '11/11.5',
    '11.5',
    '11.5/12',
    '12',
    '12/12.5',
    '12.5',
    '12.5/13',
    '13',
    '13/13.5',
    '13.5',
    '13.5/14',
    '14',
  ];

_cnzzLoaded = !1;
_cnzzUrls = [];

export function Goal2GoalCn(n) {
  if ((!n && n != '0') || isNaN(n)) return '';
  if (n > 14) return _handicapGive + Math.abs(n);
  if (n < -14) return _handicapAccept + Math.abs(n);
  var t = Math.abs(parseInt(n * 4));
  return n >= 0
    ? GoalCn[t].replace('{0}', _handicapGive)
    : GoalCn[t].replace('{0}', _handicapAccept);
}
