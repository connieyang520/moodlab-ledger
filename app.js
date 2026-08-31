(function () {
  'use strict';

  var STORAGE_KEY = 'ledger_transactions_v3';
  var ASSET_STORAGE_KEY = 'asset_snapshots_v1';

  var EXPENSE_CATEGORIES = [
    { id: 'food', name: '餐飲', icon: '🍔', color: '--series-1' },
    { id: 'transport', name: '交通', icon: '🚗', color: '--series-2' },
    { id: 'shopping', name: '購物', icon: '🛍️', color: '--series-3' },
    { id: 'entertainment', name: '娛樂', icon: '🎮', color: '--series-4' },
    { id: 'home', name: '居家', icon: '🏠', color: '--series-5' },
    { id: 'medical', name: '醫療', icon: '💊', color: '--series-6' },
    { id: 'education', name: '教育', icon: '📚', color: '--series-7' },
    { id: 'other_expense', name: '其他', icon: '🔖', color: '--series-8' }
  ];

  var INCOME_CATEGORIES = [
    { id: 'sublease', name: '分租收入', icon: '🏠', color: '--series-1' },
    { id: 'profit_share', name: '分潤收入', icon: '🤝', color: '--series-2' },
    { id: 'service', name: '服務收入', icon: '💼', color: '--series-3' },
    { id: 'other_income', name: '其他', icon: '🔖', color: '--series-8' }
  ];

  var WEEKDAYS = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];

  var ACCOUNT_NAMES = { personal: '個人', company: '公司' };

  var ASSET_CATEGORIES = [
    { id: 'deposits', name: '存款', icon: '💰', color: '--series-1' },
    { id: 'stocks', name: '股票', icon: '📈', color: '--series-2' },
    { id: 'funds', name: '基金', icon: '📊', color: '--series-3' },
    { id: 'insurance', name: '保險', icon: '🛡️', color: '--series-4' },
    { id: 'usStock', name: '美股', icon: '🇺🇸', color: '--series-5' },
    { id: 'usdDeposit', name: '外幣美元存款', icon: '💵', color: '--series-6' }
  ];

  var SERVICE_ITEM_GROUPS = [
    {
      label: '半永久妝容',
      items: [
        { name: '長效柔霧眉', price: 8999 },
        { name: '機器飄眉', price: 10800 },
        { name: '柔霧嘟嘟唇', price: 9800 },
        { name: '隱形眼線', price: 5699 },
        { name: 'SMP仿真毛囊紋髮（起）', price: 8000 }
      ]
    },
    {
      label: '除色調理',
      items: [
        { name: '眉毛無創除色', price: 2500 },
        { name: '唇部淡色/唇況管理', price: 3999 }
      ]
    },
    {
      label: '月訂美容',
      items: [
        { name: '睫毛管理', price: 1680 },
        { name: '野生眉雕塑', price: 1980 },
        { name: '野生眉雕塑＋睫毛管理', price: 3500 },
        { name: '肌膚管理', price: 1680 }
      ]
    },
    {
      label: '美甲',
      items: [
        { name: '單色美甲', price: 1000 },
        { name: '貓眼/鏡面款式', price: 1200 },
        { name: '帶圖設計款（起）', price: 1500 },
        { name: '本店卸甲', price: 200 },
        { name: '非本店卸甲', price: 300 }
      ]
    },
    {
      label: '美體',
      items: [
        { name: '臉部輪廓平衡療程', price: 1500 },
        { name: '體態平衡整骨', price: 1500 }
      ]
    }
  ];

  var SUBLEASE_GROUPS = [
    {
      label: '美甲師',
      items: [
        { name: '美甲師出租收入（一天）', price: 625 }
      ]
    },
    {
      label: '美容師',
      items: [
        { name: '美容師出租收入（1小時）', price: 200 },
        { name: '美容師出租收入（3小時）', price: 500 },
        { name: '美容師出租收入（8小時）', price: 1000 }
      ]
    },
    {
      label: '整骨師',
      items: [
        { name: '整骨師出租收入（1小時）', price: 200 },
        { name: '整骨師出租收入（3小時）', price: 500 },
        { name: '整骨師出租收入（8小時）', price: 1000 }
      ]
    },
    {
      label: '其他夥伴（選擇後請在備註填名稱）',
      items: [
        { name: '空間費・時租（1小時）', price: 200 },
        { name: '空間費・時租（3小時）', price: 500 },
        { name: '空間費・時租（8小時）', price: 1000 },
        { name: '空間費・日租（一天）', price: 625 }
      ]
    }
  ];

  var HOME_EXPENSE_GROUPS = [
    {
      label: '固定支出',
      items: [
        { name: '店租（單期，一個月繳兩次）', price: 19000, account: 'company' },
        { name: '店面管理費', price: 2080, account: 'company' },
        { name: '家裡房租', price: 24000, account: 'personal' },
        { name: '家裡管理費', price: 1706, account: 'personal' }
      ]
    },
    {
      label: '浮動支出（金額請自行輸入）',
      items: [
        { name: '家裡水電費', account: 'personal' },
        { name: '家裡瓦斯費', account: 'personal' },
        { name: '店裡水電費', account: 'company' },
        { name: '店裡瓦斯費', account: 'company' }
      ]
    }
  ];

  var OTHER_EXPENSE_GROUPS = [
    {
      label: '固定支出',
      items: [
        { name: '會計費', price: 2500, account: 'company' },
        { name: '網路行銷廣告', price: 5284, account: 'company' }
      ]
    },
    {
      label: '材料採購（金額請自行輸入）',
      items: [
        { name: '紋繡材料', account: 'company' },
        { name: '睫毛材料', account: 'company' },
        { name: '野生眉材料', account: 'company' },
        { name: '店內雜費', account: 'company' }
      ]
    }
  ];

  var MEDICAL_EXPENSE_GROUPS = [
    {
      label: '固定支出',
      items: [
        { name: '健保費（雙月繳）', price: 4342, account: 'personal' }
      ]
    }
  ];

  var QUICKPICKS = {
    service: { label: '服務項目（選填，自動帶入品名與金額）', groups: SERVICE_ITEM_GROUPS },
    sublease: { label: '分租項目（選填，自動帶入品名與金額）', groups: SUBLEASE_GROUPS },
    home: { label: '固定支出（選填，自動帶入品名、金額與帳戶）', groups: HOME_EXPENSE_GROUPS },
    other_expense: { label: '固定支出（選填，自動帶入品名、金額與帳戶）', groups: OTHER_EXPENSE_GROUPS },
    medical: { label: '固定支出（選填，自動帶入品名、金額與帳戶）', groups: MEDICAL_EXPENSE_GROUPS }
  };

  function buildSeedTransactions() {
    var source = window.SEED_TRANSACTIONS || [];
    return source.map(function (t) { return Object.assign({}, t); });
  }

  // ---------- State ----------
  var transactions = load();
  var assetSnapshots = loadAssets();
  var currentMonth = new Date();
  currentMonth.setDate(1);
  var activeTab = 'listView';
  var statsType = 'expense';
  var modalType = 'expense';
  var modalAccount = 'personal';
  var selectedCategoryId = null;
  var editingId = null;
  var accountFilter = localStorage.getItem('ledger_account_filter') || 'all';
  var selectedAssetMonth = assetMonthKey(new Date());
  var assetHistoryExpanded = false;

  // ---------- Storage ----------
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    if (!localStorage.getItem('ledger_seeded_v3')) {
      localStorage.setItem('ledger_seeded_v3', '1');
      var seed = buildSeedTransactions();
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)); } catch (e) {}
      return seed;
    }
    return [];
  }

  function loadAssets() {
    try {
      var raw = localStorage.getItem(ASSET_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  }

  function persistAssets() {
    localStorage.setItem(ASSET_STORAGE_KEY, JSON.stringify(assetSnapshots));
  }

  function assetMonthKey(date) {
    return date.getFullYear() + '-' + pad(date.getMonth() + 1);
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }

  // ---------- Helpers ----------
  function categoriesFor(type) {
    return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  }

  function findCategory(type, id) {
    var list = categoriesFor(type);
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return list[list.length - 1];
  }

  function monthKey(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1);
  }

  function formatMoney(n) {
    var rounded = Math.round(n * 100) / 100;
    var isInt = Math.abs(rounded - Math.round(rounded)) < 1e-9;
    var str = isInt ? String(Math.round(rounded)) : rounded.toFixed(2);
    var parts = str.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return '$' + parts.join('.');
  }

  function groupingKeyForNote(note) {
    var trimmed = note && note.trim() ? note.trim() : '（無備註）';
    var parenIdx = trimmed.indexOf('（');
    if (parenIdx > 0) return trimmed.slice(0, parenIdx).trim();
    return trimmed;
  }

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function txForMonth() {
    var key = monthKey(currentMonth);
    return transactions.filter(function (t) {
      var d = new Date(t.date + 'T00:00:00');
      if (monthKey(d) !== key) return false;
      if (accountFilter !== 'all') {
        if (t.type === 'transfer') {
          if (t.fromAccount !== accountFilter && t.toAccount !== accountFilter) return false;
        } else if (t.account !== accountFilter) {
          return false;
        }
      }
      return true;
    });
  }

  // ---------- DOM refs ----------
  var monthLabel = document.getElementById('monthLabel');
  var sumIncome = document.getElementById('sumIncome');
  var sumExpense = document.getElementById('sumExpense');
  var sumBalance = document.getElementById('sumBalance');
  var summaryTransferRow = document.getElementById('summaryTransferRow');
  var summaryTransferValue = document.getElementById('summaryTransferValue');
  var txList = document.getElementById('txList');
  var emptyState = document.getElementById('emptyState');
  var donutChart = document.getElementById('donutChart');
  var donutCenterLabel = document.getElementById('donutCenterLabel');
  var donutCenterValue = document.getElementById('donutCenterValue');
  var legendList = document.getElementById('legendList');
  var statsEmpty = document.getElementById('statsEmpty');

  var assetView = document.getElementById('assetView');
  var assetMonthInput = document.getElementById('assetMonthInput');
  var assetDepositsInput = document.getElementById('assetDepositsInput');
  var assetStocksInput = document.getElementById('assetStocksInput');
  var assetFundsInput = document.getElementById('assetFundsInput');
  var assetInsuranceInput = document.getElementById('assetInsuranceInput');
  var assetUsStockInput = document.getElementById('assetUsStockInput');
  var assetUsdRateInput = document.getElementById('assetUsdRateInput');
  var assetUsdDepositInput = document.getElementById('assetUsdDepositInput');
  var assetUsdHint = document.getElementById('assetUsdHint');
  var assetRateWarning = document.getElementById('assetRateWarning');
  var assetTotalValue = document.getElementById('assetTotalValue');
  var assetDeltaRow = document.getElementById('assetDeltaRow');
  var assetDeltaValue = document.getElementById('assetDeltaValue');
  var assetDonutChart = document.getElementById('assetDonutChart');
  var assetDonutCenterValue = document.getElementById('assetDonutCenterValue');
  var assetLegendList = document.getElementById('assetLegendList');
  var assetEmpty = document.getElementById('assetEmpty');
  var assetHistoryList = document.getElementById('assetHistoryList');
  var headerEl = document.querySelector('.header');
  var accountFilterEl = document.getElementById('accountFilter');
  var summaryCardEl = document.querySelector('.summary-card');
  var fabAddEl = document.getElementById('fabAdd');

  var modalBackdrop = document.getElementById('modalBackdrop');
  var modalTitle = document.getElementById('modalTitle');
  var modalDelete = document.getElementById('modalDelete');
  var amountInput = document.getElementById('amountInput');
  var categoryGrid = document.getElementById('categoryGrid');
  var categoryFieldGroup = document.getElementById('categoryFieldGroup');
  var accountToggleGroup = document.getElementById('accountToggleGroup');
  var transferDirectionGroup = document.getElementById('transferDirectionGroup');
  var dateInput = document.getElementById('dateInput');
  var noteInput = document.getElementById('noteInput');
  var quickPickGroup = document.getElementById('quickPickGroup');
  var quickPickLabel = document.getElementById('quickPickLabel');
  var quickPickSelect = document.getElementById('quickPickSelect');
  var commissionBaseGroup = document.getElementById('commissionBaseGroup');
  var commissionPartnerSelect = document.getElementById('commissionPartnerSelect');
  var commissionPartnerInput = document.getElementById('commissionPartnerInput');
  var commissionBaseInput = document.getElementById('commissionBaseInput');
  var commissionRateInput = document.getElementById('commissionRateInput');
  var quickPickItemsFlat = [];
  var modalTransferDirection = 'company-personal';

  // ---------- Render: header + summary ----------
  function renderMonthLabel() {
    monthLabel.textContent = currentMonth.getFullYear() + '年' + (currentMonth.getMonth() + 1) + '月';
  }

  function renderSummary(monthTx) {
    var income = 0, expense = 0, transferNet = 0, hasTransfer = false;
    monthTx.forEach(function (t) {
      if (t.type === 'income') income += t.amount;
      else if (t.type === 'expense') expense += t.amount;
      else if (t.type === 'transfer') {
        hasTransfer = true;
        if (accountFilter !== 'all') {
          if (t.toAccount === accountFilter) transferNet += t.amount;
          if (t.fromAccount === accountFilter) transferNet -= t.amount;
        }
      }
    });
    sumIncome.textContent = formatMoney(income);
    sumExpense.textContent = formatMoney(expense);
    sumBalance.textContent = formatMoney(income - expense);

    if (accountFilter !== 'all' && hasTransfer) {
      summaryTransferRow.hidden = false;
      summaryTransferValue.textContent = (transferNet >= 0 ? '+' : '') + formatMoney(transferNet);
    } else {
      summaryTransferRow.hidden = true;
    }
  }

  // ---------- Shared: transaction item element ----------
  function buildTxItemEl(t, opts) {
    opts = opts || {};
    var item = document.createElement('button');
    item.className = 'tx-item';
    item.type = 'button';

    var icon = document.createElement('div');
    icon.className = 'tx-icon';

    var main = document.createElement('div');
    main.className = 'tx-main';
    var catName = document.createElement('div');
    catName.className = 'tx-category';

    var amount = document.createElement('div');
    amount.className = 'tx-amount';

    if (t.type === 'transfer') {
      icon.style.background = 'var(--brand-accent)';
      icon.textContent = '🔄';
      catName.textContent = '轉帳';
      var dirTag = document.createElement('span');
      dirTag.className = 'tx-account-tag';
      dirTag.textContent = ACCOUNT_NAMES[t.fromAccount] + '帳→' + ACCOUNT_NAMES[t.toAccount] + '帳';
      catName.appendChild(dirTag);
      amount.style.color = 'var(--text-secondary)';
      amount.textContent = formatMoney(t.amount);
    } else {
      var cat = findCategory(t.type, t.categoryId);
      icon.style.background = 'var(' + cat.color + ')';
      icon.textContent = cat.icon;
      catName.textContent = cat.name;
      if (opts.showAccountTag) {
        var tag = document.createElement('span');
        tag.className = 'tx-account-tag';
        tag.textContent = ACCOUNT_NAMES[t.account] || '個人';
        catName.appendChild(tag);
      }
      amount.className = 'tx-amount ' + t.type;
      amount.textContent = (t.type === 'income' ? '+' : '-') + formatMoney(t.amount);
    }

    main.appendChild(catName);
    var noteText = t.note || '';
    if (opts.showDate) {
      var d = new Date(t.date + 'T00:00:00');
      var dateLabel = (d.getMonth() + 1) + '/' + d.getDate();
      noteText = noteText ? dateLabel + ' · ' + noteText : dateLabel;
    }
    if (noteText) {
      var note = document.createElement('div');
      note.className = 'tx-note';
      note.textContent = noteText;
      main.appendChild(note);
    }

    item.appendChild(icon);
    item.appendChild(main);
    item.appendChild(amount);
    item.addEventListener('click', function () { openModal('edit', t); });
    return item;
  }

  // ---------- Render: list ----------
  function renderList(monthTx) {
    txList.innerHTML = '';
    if (monthTx.length === 0) {
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;

    var byDate = {};
    monthTx.forEach(function (t) {
      (byDate[t.date] = byDate[t.date] || []).push(t);
    });
    var dates = Object.keys(byDate).sort(function (a, b) { return a < b ? 1 : -1; });

    dates.forEach(function (dateStr) {
      var group = document.createElement('div');
      group.className = 'tx-day-group';

      var d = new Date(dateStr + 'T00:00:00');
      var dayIncome = 0, dayExpense = 0;
      byDate[dateStr].forEach(function (t) {
        if (t.type === 'income') dayIncome += t.amount;
        else if (t.type === 'expense') dayExpense += t.amount;
      });

      var header = document.createElement('div');
      header.className = 'tx-day-header';

      var dateLabel = document.createElement('span');
      dateLabel.textContent = (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + WEEKDAYS[d.getDay()];
      header.appendChild(dateLabel);

      var totals = document.createElement('span');
      totals.className = 'tx-day-totals';
      if (dayIncome > 0) {
        var incomeEl = document.createElement('span');
        incomeEl.className = 'day-income';
        incomeEl.textContent = '收入 +' + formatMoney(dayIncome);
        totals.appendChild(incomeEl);
      }
      if (dayExpense > 0) {
        var expenseEl = document.createElement('span');
        expenseEl.className = 'day-expense';
        expenseEl.textContent = '支出 -' + formatMoney(dayExpense);
        totals.appendChild(expenseEl);
      }
      header.appendChild(totals);
      group.appendChild(header);

      byDate[dateStr].forEach(function (t) {
        group.appendChild(buildTxItemEl(t, { showAccountTag: accountFilter === 'all' }));
      });

      txList.appendChild(group);
    });
  }

  // ---------- Render: stats ----------
  function renderStats(monthTx) {
    var filtered = monthTx.filter(function (t) { return t.type === statsType; });
    var cats = categoriesFor(statsType);
    var totals = {};
    var grandTotal = 0;
    filtered.forEach(function (t) {
      totals[t.categoryId] = (totals[t.categoryId] || 0) + t.amount;
      grandTotal += t.amount;
    });

    donutCenterLabel.textContent = statsType === 'income' ? '收入總額' : '支出總額';
    donutCenterValue.textContent = formatMoney(grandTotal);

    legendList.innerHTML = '';

    if (grandTotal <= 0) {
      donutChart.style.background = 'var(--gridline)';
      statsEmpty.hidden = false;
      return;
    }
    statsEmpty.hidden = true;

    var rows = cats
      .map(function (c) { return { cat: c, amount: totals[c.id] || 0 }; })
      .filter(function (r) { return r.amount > 0; })
      .sort(function (a, b) { return b.amount - a.amount; });

    var gradientParts = [];
    var angle = 0;
    rows.forEach(function (r) {
      var pct = r.amount / grandTotal;
      var start = angle;
      var end = angle + pct * 360;
      gradientParts.push('var(' + r.cat.color + ') ' + start.toFixed(2) + 'deg ' + end.toFixed(2) + 'deg');
      angle = end;
    });
    donutChart.style.background = 'conic-gradient(' + gradientParts.join(', ') + ')';

    rows.forEach(function (r) {
      var pct = Math.round((r.amount / grandTotal) * 100);
      var li = document.createElement('li');
      li.className = 'legend-item';

      var swatch = document.createElement('span');
      swatch.className = 'legend-swatch';
      swatch.style.background = 'var(' + r.cat.color + ')';

      var name = document.createElement('span');
      name.className = 'legend-name';
      name.textContent = r.cat.icon + ' ' + r.cat.name;

      var pctEl = document.createElement('span');
      pctEl.className = 'legend-pct';
      pctEl.textContent = pct + '%';

      var amt = document.createElement('span');
      amt.className = 'legend-amount';
      amt.textContent = formatMoney(r.amount);

      li.appendChild(swatch);
      li.appendChild(name);
      li.appendChild(pctEl);
      li.appendChild(amt);
      legendList.appendChild(li);
    });
  }

  function renderAll() {
    renderMonthLabel();
    var monthTx = txForMonth();
    renderSummary(monthTx);
    renderList(monthTx);
    renderStats(monthTx);
  }

  // ---------- Month navigation ----------
  document.getElementById('prevMonth').addEventListener('click', function () {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderAll();
  });
  document.getElementById('nextMonth').addEventListener('click', function () {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderAll();
  });

  // ---------- Account filter ----------
  var accountFilterBtns = document.querySelectorAll('.account-filter-btn');
  accountFilterBtns.forEach(function (btn) {
    if (btn.dataset.account === accountFilter) {
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    }
    btn.addEventListener('click', function () {
      accountFilter = btn.dataset.account;
      localStorage.setItem('ledger_account_filter', accountFilter);
      accountFilterBtns.forEach(function (b) {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      renderAll();
    });
  });

  // ---------- Tab bar ----------
  var tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activeTab = btn.dataset.tab;
      tabButtons.forEach(function (b) { b.classList.toggle('active', b === btn); });
      document.getElementById('listView').hidden = activeTab !== 'listView';
      document.getElementById('statsView').hidden = activeTab !== 'statsView';
      assetView.hidden = activeTab !== 'assetView';
      var onAsset = activeTab === 'assetView';
      headerEl.hidden = onAsset;
      accountFilterEl.hidden = onAsset;
      summaryCardEl.hidden = onAsset;
      fabAddEl.hidden = onAsset;
      if (onAsset) renderAssetView();
    });
  });

  // ---------- Stats type toggle ----------
  var statsToggleBtns = document.querySelectorAll('.stats-toggle-btn');
  statsToggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      statsType = btn.dataset.stype;
      statsToggleBtns.forEach(function (b) {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      renderStats(txForMonth());
    });
  });

  // ---------- Modal ----------
  function renderCategoryGrid() {
    categoryGrid.innerHTML = '';
    categoriesFor(modalType).forEach(function (cat) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'category-chip' + (cat.id === selectedCategoryId ? ' selected' : '');
      chip.innerHTML =
        '<span class="chip-icon" style="background:var(' + cat.color + ')">' + cat.icon + '</span>' +
        '<span class="chip-label">' + cat.name + '</span>';
      chip.addEventListener('click', function () {
        selectedCategoryId = cat.id;
        if (modalType === 'income') {
          modalAccount = 'company';
          accountToggleBtns.forEach(function (b) {
            var active = b.dataset.account === 'company';
            b.classList.toggle('active', active);
            b.setAttribute('aria-selected', active ? 'true' : 'false');
          });
        }
        renderCategoryGrid();
        updateQuickPick();
      });
      categoryGrid.appendChild(chip);
    });
  }

  function updateQuickPick() {
    quickPickItemsFlat = [];

    if (modalType === 'income' && selectedCategoryId === 'profit_share') {
      quickPickGroup.hidden = true;
      quickPickSelect.innerHTML = '';
      commissionBaseGroup.hidden = false;
      commissionPartnerSelect.value = '美容師';
      commissionPartnerInput.hidden = true;
      modalAccount = 'company';
      accountToggleBtns.forEach(function (b) {
        var active = b.dataset.account === 'company';
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      return;
    }
    commissionBaseGroup.hidden = true;

    var config = QUICKPICKS[selectedCategoryId];
    if (!config) {
      quickPickGroup.hidden = true;
      quickPickSelect.innerHTML = '';
      return;
    }
    quickPickGroup.hidden = false;
    quickPickLabel.textContent = config.label;
    quickPickSelect.innerHTML = '<option value="">— 自訂 —</option>';
    config.groups.forEach(function (group) {
      var optgroup = document.createElement('optgroup');
      optgroup.label = group.label;
      group.items.forEach(function (item) {
        var idx = quickPickItemsFlat.length;
        quickPickItemsFlat.push(item);
        var opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = item.name + (item.price !== undefined ? '（$' + item.price.toLocaleString() + '）' : '');
        optgroup.appendChild(opt);
      });
      quickPickSelect.appendChild(optgroup);
    });
    quickPickSelect.value = '';
  }

  function applyQuickPickItem(item) {
    amountInput.value = item.price !== undefined ? item.price : '';
    noteInput.value = item.name;
    var acct = item.account || 'company';
    modalAccount = acct;
    accountToggleBtns.forEach(function (b) {
      var active = b.dataset.account === acct;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  quickPickSelect.addEventListener('change', function () {
    var idx = quickPickSelect.value;
    if (idx === '') return;
    var item = quickPickItemsFlat[Number(idx)];
    if (item) applyQuickPickItem(item);
  });

  function getCommissionPartnerName() {
    if (commissionPartnerSelect.value === '__custom__') {
      return commissionPartnerInput.value.trim();
    }
    return commissionPartnerSelect.value;
  }

  function updateCommissionCalc() {
    var base = parseFloat(commissionBaseInput.value) || 0;
    var rateRaw = parseFloat(commissionRateInput.value);
    var rate = isNaN(rateRaw) ? 30 : rateRaw;
    var computed = Math.round(base * rate / 100);
    amountInput.value = computed || '';
    var partner = getCommissionPartnerName();
    noteInput.value = (partner ? partner + '｜' : '') + '抽成分潤（客人消費$' + base.toLocaleString() + ' × ' + rate + '%）';
  }

  commissionPartnerSelect.addEventListener('change', function () {
    commissionPartnerInput.hidden = commissionPartnerSelect.value !== '__custom__';
    if (!commissionPartnerInput.hidden) {
      commissionPartnerInput.value = '';
      commissionPartnerInput.focus();
    }
    updateCommissionCalc();
  });
  commissionPartnerInput.addEventListener('input', updateCommissionCalc);
  commissionBaseInput.addEventListener('input', updateCommissionCalc);
  commissionRateInput.addEventListener('input', updateCommissionCalc);

  function updateModalTypeUI() {
    var isTransfer = modalType === 'transfer';
    accountToggleGroup.hidden = isTransfer;
    transferDirectionGroup.hidden = !isTransfer;
    categoryFieldGroup.hidden = isTransfer;
    if (isTransfer) {
      quickPickGroup.hidden = true;
      commissionBaseGroup.hidden = true;
    }
  }

  var typeToggleBtns = document.querySelectorAll('.type-toggle-btn');
  typeToggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      modalType = btn.dataset.type;
      selectedCategoryId = null;
      typeToggleBtns.forEach(function (b) {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      updateModalTypeUI();
      if (modalType !== 'transfer') {
        renderCategoryGrid();
        updateQuickPick();
      }
    });
  });

  var accountToggleBtns = document.querySelectorAll('#accountToggleGroup .account-toggle-btn');
  accountToggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      modalAccount = btn.dataset.account;
      accountToggleBtns.forEach(function (b) {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
    });
  });

  var transferDirectionBtns = document.querySelectorAll('#transferDirectionGroup .account-toggle-btn');
  transferDirectionBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      modalTransferDirection = btn.dataset.direction;
      transferDirectionBtns.forEach(function (b) {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
    });
  });

  function openModal(mode, tx) {
    editingId = mode === 'edit' ? tx.id : null;
    modalType = tx ? tx.type : 'expense';
    selectedCategoryId = (tx && tx.type !== 'transfer') ? tx.categoryId : null;
    modalTransferDirection = (tx && tx.type === 'transfer') ? (tx.fromAccount + '-' + tx.toAccount) : 'company-personal';
    modalAccount = (tx && tx.type !== 'transfer') ? (tx.account || 'personal') : (accountFilter !== 'all' ? accountFilter : 'personal');

    modalTitle.textContent = mode === 'edit' ? '編輯記帳' : '新增記帳';
    modalDelete.hidden = mode !== 'edit';

    typeToggleBtns.forEach(function (b) {
      var active = b.dataset.type === modalType;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    accountToggleBtns.forEach(function (b) {
      var active = b.dataset.account === modalAccount;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    transferDirectionBtns.forEach(function (b) {
      var active = b.dataset.direction === modalTransferDirection;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    amountInput.value = tx ? tx.amount : '';
    dateInput.value = tx ? tx.date : todayStr();
    noteInput.value = tx ? tx.note || '' : '';
    commissionPartnerSelect.value = '美容師';
    commissionPartnerInput.hidden = true;
    commissionPartnerInput.value = '';
    commissionBaseInput.value = '';
    commissionRateInput.value = '';

    updateModalTypeUI();
    if (modalType !== 'transfer') {
      renderCategoryGrid();
      updateQuickPick();
    }
    modalBackdrop.hidden = false;
    setTimeout(function () { amountInput.focus(); }, 50);
  }

  function closeModal() {
    modalBackdrop.hidden = true;
  }

  document.getElementById('fabAdd').addEventListener('click', function () { openModal('add', null); });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', function (e) {
    if (e.target === modalBackdrop) closeModal();
  });

  document.getElementById('saveBtn').addEventListener('click', function () {
    var amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) {
      amountInput.focus();
      return;
    }
    if (modalType !== 'transfer' && !selectedCategoryId) {
      categoryGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    var date = dateInput.value || todayStr();
    var note = noteInput.value.trim();

    var txData;
    if (modalType === 'transfer') {
      var dirParts = modalTransferDirection.split('-');
      txData = {
        type: 'transfer',
        fromAccount: dirParts[0],
        toAccount: dirParts[1],
        amount: amount,
        date: date,
        note: note
      };
    } else {
      txData = {
        type: modalType,
        account: modalAccount,
        amount: amount,
        categoryId: selectedCategoryId,
        date: date,
        note: note
      };
    }

    if (editingId) {
      var idx = transactions.findIndex(function (t) { return t.id === editingId; });
      if (idx !== -1) {
        txData.id = editingId;
        transactions[idx] = txData;
      }
    } else {
      txData.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      transactions.push(txData);
    }

    persist();
    var savedDate = new Date(date + 'T00:00:00');
    currentMonth = new Date(savedDate.getFullYear(), savedDate.getMonth(), 1);
    closeModal();
    renderAll();
  });

  modalDelete.addEventListener('click', function () {
    if (!editingId) return;
    transactions = transactions.filter(function (t) { return t.id !== editingId; });
    persist();
    closeModal();
    renderAll();
  });

  // ---------- Asset view ----------
  var ASSET_HISTORY_PAGE = 12;
  var assetSaveBtn = document.getElementById('assetSaveBtn');

  function findAssetSnapshot(month) {
    return assetSnapshots.filter(function (s) { return s.month === month; })[0] || null;
  }

  function assetSnapshotTotal(s) {
    return (s.deposits || 0) + (s.stocks || 0) + (s.funds || 0) +
      (s.usStockUsd || 0) * (s.usdRate || 0) + (s.usdDepositUsd || 0) * (s.usdRate || 0) +
      (s.insuranceUsd || 0) * (s.usdRate || 0);
  }

  function latestAssetSnapshotBefore(month) {
    var before = assetSnapshots
      .filter(function (s) { return s.month < month; })
      .sort(function (a, b) { return a.month < b.month ? 1 : -1; });
    return before[0] || null;
  }

  function currentFormAssetValues() {
    return {
      deposits: parseFloat(assetDepositsInput.value) || 0,
      stocks: parseFloat(assetStocksInput.value) || 0,
      funds: parseFloat(assetFundsInput.value) || 0,
      usStockUsd: parseFloat(assetUsStockInput.value) || 0,
      usdRate: parseFloat(assetUsdRateInput.value) || 0,
      usdDepositUsd: parseFloat(assetUsdDepositInput.value) || 0,
      insuranceUsd: parseFloat(assetInsuranceInput.value) || 0
    };
  }

  function renderAssetSummary() {
    var vals = currentFormAssetValues();
    var usStockTwd = vals.usStockUsd * vals.usdRate;
    var usdDepositTwd = vals.usdDepositUsd * vals.usdRate;
    var insuranceTwd = vals.insuranceUsd * vals.usdRate;
    assetUsdHint.textContent = '美股換算台幣：' + formatMoney(usStockTwd) + '　外幣存款換算台幣：' + formatMoney(usdDepositTwd) + '　保險換算台幣：' + formatMoney(insuranceTwd);
    var total = vals.deposits + vals.stocks + vals.funds + usStockTwd + usdDepositTwd + insuranceTwd;
    assetTotalValue.textContent = formatMoney(total);

    var hasUsdAmounts = vals.usStockUsd > 0 || vals.usdDepositUsd > 0 || vals.insuranceUsd > 0;
    var rateMissing = vals.usdRate <= 0 && hasUsdAmounts;
    assetRateWarning.hidden = !rateMissing;
    assetUsdRateInput.classList.toggle('rate-warning', rateMissing);

    var prev = latestAssetSnapshotBefore(selectedAssetMonth);
    if (prev) {
      var prevTotal = assetSnapshotTotal(prev);
      var delta = total - prevTotal;
      var pct = prevTotal !== 0 ? (delta / Math.abs(prevTotal)) * 100 : 0;
      assetDeltaRow.hidden = false;
      assetDeltaValue.textContent = (delta >= 0 ? '+' : '') + formatMoney(delta) + '（' + (delta >= 0 ? '+' : '') + pct.toFixed(1) + '%，較 ' + prev.month.replace('-', '/') + '）';
      assetDeltaValue.classList.toggle('positive', delta >= 0);
      assetDeltaValue.classList.toggle('negative', delta < 0);
    } else {
      assetDeltaRow.hidden = true;
    }

    var rows = ASSET_CATEGORIES
      .map(function (c) {
        var amount = c.id === 'usStock' ? usStockTwd : c.id === 'usdDeposit' ? usdDepositTwd : c.id === 'insurance' ? insuranceTwd : vals[c.id];
        return { cat: c, amount: amount };
      })
      .filter(function (r) { return r.amount > 0; })
      .sort(function (a, b) { return b.amount - a.amount; });

    assetDonutCenterValue.textContent = formatMoney(total);
    assetLegendList.innerHTML = '';

    if (total <= 0) {
      assetDonutChart.style.background = 'var(--gridline)';
      assetEmpty.hidden = false;
      return;
    }
    assetEmpty.hidden = true;

    var gradientParts = [];
    var angle = 0;
    rows.forEach(function (r) {
      var pct = r.amount / total;
      var start = angle;
      var end = angle + pct * 360;
      gradientParts.push('var(' + r.cat.color + ') ' + start.toFixed(2) + 'deg ' + end.toFixed(2) + 'deg');
      angle = end;
    });
    assetDonutChart.style.background = 'conic-gradient(' + gradientParts.join(', ') + ')';

    rows.forEach(function (r) {
      var pct = Math.round((r.amount / total) * 100);
      var li = document.createElement('li');
      li.className = 'legend-item';

      var swatch = document.createElement('span');
      swatch.className = 'legend-swatch';
      swatch.style.background = 'var(' + r.cat.color + ')';

      var name = document.createElement('span');
      name.className = 'legend-name';
      name.textContent = r.cat.icon + ' ' + r.cat.name;

      var pctEl = document.createElement('span');
      pctEl.className = 'legend-pct';
      pctEl.textContent = pct + '%';

      var amt = document.createElement('span');
      amt.className = 'legend-amount';
      amt.textContent = formatMoney(r.amount);

      li.appendChild(swatch);
      li.appendChild(name);
      li.appendChild(pctEl);
      li.appendChild(amt);
      assetLegendList.appendChild(li);
    });
  }

  function renderAssetHistory() {
    var sorted = assetSnapshots.slice().sort(function (a, b) { return a.month < b.month ? 1 : -1; });
    assetHistoryList.innerHTML = '';
    if (sorted.length === 0) {
      assetHistoryList.innerHTML = '<p class="empty-state">還沒有任何淨值記錄</p>';
      return;
    }
    var keys = assetHistoryExpanded ? sorted : sorted.slice(0, ASSET_HISTORY_PAGE);
    keys.forEach(function (s) {
      var total = assetSnapshotTotal(s);
      var prev = latestAssetSnapshotBefore(s.month);
      var row = document.createElement('div');
      row.className = 'report-trend-row';
      var html =
        '<span class="report-trend-month">' + s.month.replace('-', '/') + '</span>' +
        '<span class="report-trend-figures"><span class="balance">' + formatMoney(total) + '</span>';
      if (prev) {
        var delta = total - assetSnapshotTotal(prev);
        html += '<span class="' + (delta >= 0 ? 'income' : 'expense') + '">' + (delta >= 0 ? '+' : '') + formatMoney(delta) + '</span>';
      }
      html += '</span>';
      row.innerHTML = html;
      assetHistoryList.appendChild(row);
    });
    if (sorted.length > ASSET_HISTORY_PAGE) {
      var toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'report-trend-toggle';
      toggleBtn.textContent = assetHistoryExpanded
        ? '收合，只顯示最近 ' + ASSET_HISTORY_PAGE + ' 個月'
        : '顯示全部 ' + sorted.length + ' 個月（目前顯示最近 ' + ASSET_HISTORY_PAGE + ' 個月）';
      toggleBtn.addEventListener('click', function () {
        assetHistoryExpanded = !assetHistoryExpanded;
        renderAssetHistory();
      });
      assetHistoryList.appendChild(toggleBtn);
    }
  }

  function renderAssetView() {
    assetMonthInput.value = selectedAssetMonth;
    var current = findAssetSnapshot(selectedAssetMonth);
    var src = current || latestAssetSnapshotBefore(selectedAssetMonth);
    assetDepositsInput.value = src ? src.deposits : '';
    assetStocksInput.value = src ? src.stocks : '';
    assetFundsInput.value = src ? src.funds : '';
    assetInsuranceInput.value = src ? src.insuranceUsd : '';
    assetUsStockInput.value = src ? src.usStockUsd : '';
    assetUsdRateInput.value = src ? src.usdRate : '';
    assetUsdDepositInput.value = src ? src.usdDepositUsd : '';
    renderAssetSummary();
    renderAssetHistory();
  }

  assetMonthInput.addEventListener('change', function () {
    if (!assetMonthInput.value) return;
    selectedAssetMonth = assetMonthInput.value;
    renderAssetView();
  });

  [assetDepositsInput, assetStocksInput, assetFundsInput, assetInsuranceInput, assetUsStockInput, assetUsdRateInput, assetUsdDepositInput].forEach(function (input) {
    input.addEventListener('input', renderAssetSummary);
  });

  assetSaveBtn.addEventListener('click', function () {
    var vals = currentFormAssetValues();
    var hasUsdAmounts = vals.usStockUsd > 0 || vals.usdDepositUsd > 0 || vals.insuranceUsd > 0;
    if (vals.usdRate <= 0 && hasUsdAmounts) {
      var proceed = confirm('美金匯率是 0，美股／外幣存款／保險金額不會被計入總淨值，確定要這樣儲存嗎？');
      if (!proceed) return;
    }
    var idx = assetSnapshots.findIndex(function (s) { return s.month === selectedAssetMonth; });
    var snapshot = {
      id: idx >= 0 ? assetSnapshots[idx].id : Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      month: selectedAssetMonth,
      deposits: vals.deposits,
      stocks: vals.stocks,
      funds: vals.funds,
      usStockUsd: vals.usStockUsd,
      usdRate: vals.usdRate,
      usdDepositUsd: vals.usdDepositUsd,
      insuranceUsd: vals.insuranceUsd,
      updatedAt: new Date().toISOString()
    };
    if (idx >= 0) assetSnapshots[idx] = snapshot;
    else assetSnapshots.push(snapshot);
    persistAssets();
    renderAssetView();
  });

  // ---------- Report sheet ----------
  var reportBackdrop = document.getElementById('reportBackdrop');
  var rankType = 'expense';
  var rankScope = 'all';
  var monthlyTrendExpanded = false;

  function txMatchesAccountFilter(t) {
    if (accountFilter === 'all') return true;
    if (t.type === 'transfer') {
      return t.fromAccount === accountFilter || t.toAccount === accountFilter;
    }
    return t.account === accountFilter;
  }

  function computeAccountBalances() {
    var personal = 0, company = 0;
    transactions.forEach(function (t) {
      if (t.type === 'income') {
        if (t.account === 'personal') personal += t.amount;
        else if (t.account === 'company') company += t.amount;
      } else if (t.type === 'expense') {
        if (t.account === 'personal') personal -= t.amount;
        else if (t.account === 'company') company -= t.amount;
      } else if (t.type === 'transfer') {
        if (t.fromAccount === 'personal') personal -= t.amount;
        if (t.fromAccount === 'company') company -= t.amount;
        if (t.toAccount === 'personal') personal += t.amount;
        if (t.toAccount === 'company') company += t.amount;
      }
    });
    return { personal: personal, company: company };
  }

  function renderReportBalances() {
    var b = computeAccountBalances();
    document.getElementById('balancePersonal').textContent = formatMoney(b.personal);
    document.getElementById('balanceCompany').textContent = formatMoney(b.company);
    document.getElementById('balanceTotal').textContent = formatMoney(b.personal + b.company);
  }

  function currentScopeLabel() {
    if (rankScope === 'all') return '累計至今';
    if (rankScope === 'month') return '指定月份：' + document.getElementById('rankMonthInput').value;
    return '指定範圍：' + (document.getElementById('rankRangeFrom').value || '不限') + ' ~ ' + (document.getElementById('rankRangeTo').value || '不限');
  }

  function renderMonthlyTrend() {
    var titleEl = document.getElementById('monthlyTrendTitle');
    if (titleEl) titleEl.textContent = '各月統計（' + currentScopeLabel() + '）';

    var byMonth = {};
    transactions.forEach(function (t) {
      if (!txMatchesAccountFilter(t)) return;
      if (rankScope !== 'all' && !rankMatchesScope(t)) return;
      var d = new Date(t.date + 'T00:00:00');
      var key = d.getFullYear() + '-' + pad(d.getMonth() + 1);
      if (!byMonth[key]) byMonth[key] = { income: 0, expense: 0, transfer: 0, incomeCount: 0, year: d.getFullYear(), month: d.getMonth() + 1 };
      if (t.type === 'income') { byMonth[key].income += t.amount; byMonth[key].incomeCount++; }
      else if (t.type === 'expense') byMonth[key].expense += t.amount;
      else if (t.type === 'transfer' && accountFilter !== 'all') {
        if (t.toAccount === accountFilter) byMonth[key].transfer += t.amount;
        if (t.fromAccount === accountFilter) byMonth[key].transfer -= t.amount;
      }
    });
    var allKeys = Object.keys(byMonth).sort().reverse();
    var container = document.getElementById('monthlyTrendList');
    container.innerHTML = '';
    if (allKeys.length === 0) {
      container.innerHTML = '<p class="empty-state">還沒有資料</p>';
      return;
    }
    var MONTHLY_TREND_PAGE = 12;
    var keys = monthlyTrendExpanded ? allKeys : allKeys.slice(0, MONTHLY_TREND_PAGE);
    keys.forEach(function (key) {
      var m = byMonth[key];
      var row = document.createElement('div');
      row.className = 'report-trend-row';
      var html =
        '<span class="report-trend-month">' + m.year + '/' + pad(m.month) + '</span>' +
        '<span class="report-trend-figures">' +
          '<span class="income">+' + formatMoney(m.income) + '</span>' +
          '<span class="expense">-' + formatMoney(m.expense) + '</span>' +
          '<span class="balance">' + formatMoney(m.income - m.expense) + '</span>' +
        '</span>';
      if (m.incomeCount > 0) {
        html += '<span class="report-trend-transfer">收入交易筆數（來客次數估計）' + m.incomeCount + '筆</span>';
      }
      if (accountFilter !== 'all' && m.transfer !== 0) {
        html += '<span class="report-trend-transfer">轉帳 ' + (m.transfer >= 0 ? '+' : '') + formatMoney(m.transfer) + '</span>';
      }
      row.innerHTML = html;
      container.appendChild(row);
    });
    if (allKeys.length > MONTHLY_TREND_PAGE) {
      var toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'report-trend-toggle';
      toggleBtn.textContent = monthlyTrendExpanded
        ? '收合，只顯示最近 ' + MONTHLY_TREND_PAGE + ' 個月'
        : '顯示全部 ' + allKeys.length + ' 個月（目前顯示最近 ' + MONTHLY_TREND_PAGE + ' 個月）';
      toggleBtn.addEventListener('click', function () {
        monthlyTrendExpanded = !monthlyTrendExpanded;
        renderMonthlyTrend();
      });
      container.appendChild(toggleBtn);
    }
  }

  var rankCategorySelect = document.getElementById('rankCategorySelect');

  function populateRankCategorySelect() {
    rankCategorySelect.innerHTML = '<option value="">全部分類（依分類排名）</option>';
    categoriesFor(rankType).forEach(function (c) {
      var opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.icon + ' ' + c.name + '（依細項排名）';
      rankCategorySelect.appendChild(opt);
    });
    rankCategorySelect.value = '';
  }

  function rankMatchesScope(t) {
    if (rankScope === 'month') {
      var monthVal = document.getElementById('rankMonthInput').value;
      if (!monthVal) return true;
      return t.date.slice(0, 7) === monthVal;
    }
    if (rankScope === 'range') {
      var from = document.getElementById('rankRangeFrom').value;
      var to = document.getElementById('rankRangeTo').value;
      if (from && t.date < from) return false;
      if (to && t.date > to) return false;
      return true;
    }
    return true;
  }

  function renderRanking() {
    var selectedCat = rankCategorySelect.value;
    var rows, grand;

    if (selectedCat) {
      // Item-level breakdown within one category, grouped by note text.
      var itemTotals = {};
      var itemCounts = {};
      grand = 0;
      transactions.forEach(function (t) {
        if (t.type !== rankType || t.categoryId !== selectedCat) return;
        if (!txMatchesAccountFilter(t)) return;
        if (!rankMatchesScope(t)) return;
        var key = groupingKeyForNote(t.note);
        itemTotals[key] = (itemTotals[key] || 0) + t.amount;
        itemCounts[key] = (itemCounts[key] || 0) + 1;
        grand += t.amount;
      });
      var itemRows = Object.keys(itemTotals)
        .map(function (name) { return { name: name, icon: '', amount: itemTotals[name], count: itemCounts[name] }; })
        .sort(function (a, b) { return b.amount - a.amount; });

      var TOP_N = 7;
      rows = itemRows.slice(0, TOP_N);
      rows.forEach(function (r, i) { r.color = '--series-' + (i + 1); });
      if (itemRows.length > TOP_N) {
        var rest = itemRows.slice(TOP_N);
        var restAmount = rest.reduce(function (sum, r) { return sum + r.amount; }, 0);
        var restCount = rest.reduce(function (sum, r) { return sum + r.count; }, 0);
        rows.push({ name: '其他（' + rest.length + ' 項）', icon: '', amount: restAmount, count: restCount, color: '--series-8' });
      }
    } else {
      var totals = {};
      var counts = {};
      grand = 0;
      transactions.forEach(function (t) {
        if (t.type !== rankType) return;
        if (!txMatchesAccountFilter(t)) return;
        if (!rankMatchesScope(t)) return;
        totals[t.categoryId] = (totals[t.categoryId] || 0) + t.amount;
        counts[t.categoryId] = (counts[t.categoryId] || 0) + 1;
        grand += t.amount;
      });
      rows = categoriesFor(rankType)
        .map(function (c) { return { name: c.name, icon: c.icon, amount: totals[c.id] || 0, count: counts[c.id] || 0, color: c.color }; })
        .filter(function (r) { return r.amount > 0; })
        .sort(function (a, b) { return b.amount - a.amount; });
    }

    var list = document.getElementById('rankList');
    var donut = document.getElementById('rankDonutChart');
    var centerLabel = document.getElementById('rankDonutCenterLabel');
    var centerValue = document.getElementById('rankDonutCenterValue');
    list.innerHTML = '';

    if (rows.length === 0 || grand <= 0) {
      list.innerHTML = '<p class="empty-state">還沒有資料</p>';
      donut.style.background = 'var(--gridline)';
      centerLabel.textContent = rankType === 'income' ? '收入總額' : '支出總額';
      centerValue.textContent = '$0';
      return;
    }

    centerLabel.textContent = rankType === 'income' ? '收入總額' : '支出總額';
    centerValue.textContent = formatMoney(grand);

    var gradientParts = [];
    var angle = 0;
    rows.forEach(function (r) {
      var pct = r.amount / grand;
      var start = angle;
      var end = angle + pct * 360;
      gradientParts.push('var(' + r.color + ') ' + start.toFixed(2) + 'deg ' + end.toFixed(2) + 'deg');
      angle = end;
    });
    donut.style.background = 'conic-gradient(' + gradientParts.join(', ') + ')';

    rows.forEach(function (r, i) {
      var pct = Math.round((r.amount / grand) * 100);
      var li = document.createElement('li');
      li.className = 'legend-item';
      var label = r.icon ? (r.icon + ' ' + r.name) : r.name;
      li.innerHTML =
        '<span class="legend-swatch" style="background:var(' + r.color + ')"></span>' +
        '<span class="legend-name">' + (i + 1) + '. ' + label + '（' + r.count + '筆）</span>' +
        '<span class="legend-pct">' + pct + '%</span>' +
        '<span class="legend-amount">' + formatMoney(r.amount) + '</span>';
      list.appendChild(li);
    });
  }

  function renderItemMonthTable() {
    var table = document.getElementById('itemMonthTable');
    try {
      renderItemMonthTableInner(table);
    } catch (err) {
      table.innerHTML = '<tr><td class="empty-state">表格顯示發生錯誤：' + err.message + '</td></tr>';
    }
  }

  function renderItemMonthTableInner(table) {
    var selectedCat = rankCategorySelect.value;

    var matches = transactions.filter(function (t) {
      if (t.type !== rankType) return false;
      if (typeof t.date !== 'string' || t.date.length < 7) return false;
      if (!txMatchesAccountFilter(t)) return false;
      if (selectedCat && t.categoryId !== selectedCat) return false;
      return true;
    });

    if (matches.length === 0) {
      table.innerHTML = '<tr><td class="empty-state">還沒有資料</td></tr>';
      return;
    }

    function rowKeyFor(t) {
      if (selectedCat) return groupingKeyForNote(t.note);
      return t.categoryId;
    }
    function rowLabelFor(key) {
      if (selectedCat) return key;
      var cat = findCategory(rankType, key);
      return cat.icon + ' ' + cat.name;
    }

    var monthSet = {};
    matches.forEach(function (t) { monthSet[t.date.slice(0, 7)] = true; });
    var months = Object.keys(monthSet).sort();

    var counts = {};
    var rowTotals = {};
    var monthTotals = {};
    matches.forEach(function (t) {
      var key = rowKeyFor(t);
      var month = t.date.slice(0, 7);
      counts[key] = counts[key] || {};
      counts[key][month] = (counts[key][month] || 0) + 1;
      rowTotals[key] = (rowTotals[key] || 0) + 1;
      monthTotals[month] = (monthTotals[month] || 0) + 1;
    });

    var rowKeys = Object.keys(rowTotals).sort(function (a, b) { return rowTotals[b] - rowTotals[a]; });

    var html = '<thead><tr><th>品項</th>';
    months.forEach(function (m) { html += '<th>' + m.slice(2).replace('-', '/') + '</th>'; });
    html += '<th>合計</th></tr></thead><tbody>';
    rowKeys.forEach(function (key) {
      html += '<tr><td>' + rowLabelFor(key) + '</td>';
      months.forEach(function (m) {
        var c = (counts[key] && counts[key][m]) || 0;
        html += '<td>' + (c || '—') + '</td>';
      });
      html += '<td>' + rowTotals[key] + '</td></tr>';
    });
    html += '</tbody><tfoot><tr><td>合計</td>';
    months.forEach(function (m) { html += '<td>' + (monthTotals[m] || 0) + '</td>'; });
    html += '<td>' + matches.length + '</td></tr></tfoot>';

    table.innerHTML = html;
  }

  var rankTypeBtns = document.querySelectorAll('#rankTypeToggle .stats-toggle-btn');
  rankTypeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      rankType = btn.dataset.rtype;
      rankTypeBtns.forEach(function (b) {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      populateRankCategorySelect();
      renderRanking();
      renderItemMonthTable();
    });
  });

  rankCategorySelect.addEventListener('change', function () {
    renderRanking();
    renderItemMonthTable();
  });

  var rankScopeBtns = document.querySelectorAll('#rankScopeToggle .stats-toggle-btn');
  var rankMonthInput = document.getElementById('rankMonthInput');
  var rankRangeInputs = document.getElementById('rankRangeInputs');
  var rankRangeFrom = document.getElementById('rankRangeFrom');
  var rankRangeTo = document.getElementById('rankRangeTo');

  function updateRankScopeInputsVisibility() {
    rankMonthInput.hidden = rankScope !== 'month';
    rankRangeInputs.hidden = rankScope !== 'range';
  }

  rankScopeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      rankScope = btn.dataset.scope;
      rankScopeBtns.forEach(function (b) {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      updateRankScopeInputsVisibility();
      renderRanking();
      renderMonthlyTrend();
    });
  });

  function rescopeChanged() {
    renderRanking();
    renderMonthlyTrend();
  }
  rankMonthInput.addEventListener('change', rescopeChanged);
  rankRangeFrom.addEventListener('change', rescopeChanged);
  rankRangeTo.addEventListener('change', rescopeChanged);

  var lastSearchResults = [];

  function runSearch() {
    var kw = document.getElementById('searchKeyword').value.trim().toLowerCase();
    var min = parseFloat(document.getElementById('searchAmountMin').value);
    var max = parseFloat(document.getElementById('searchAmountMax').value);
    var from = document.getElementById('searchDateFrom').value;
    var to = document.getElementById('searchDateTo').value;

    var results = transactions.filter(function (t) {
      if (!txMatchesAccountFilter(t)) return false;
      if (!isNaN(min) && t.amount < min) return false;
      if (!isNaN(max) && t.amount > max) return false;
      if (from && t.date < from) return false;
      if (to && t.date > to) return false;
      if (kw) {
        var catName = t.type === 'transfer' ? '轉帳' : findCategory(t.type, t.categoryId).name;
        var haystack = (catName + ' ' + (t.note || '')).toLowerCase();
        if (haystack.indexOf(kw) === -1) return false;
      }
      return true;
    }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });

    lastSearchResults = results;

    var container = document.getElementById('searchResults');
    var emptyEl = document.getElementById('searchEmpty');
    var copyBtn = document.getElementById('copySearchBtn');
    container.innerHTML = '';
    if (results.length === 0) {
      emptyEl.hidden = false;
      copyBtn.hidden = true;
      return;
    }
    emptyEl.hidden = true;
    copyBtn.hidden = false;
    copyBtn.textContent = '📋 複製這 ' + results.length + ' 筆搜尋結果';
    results.slice(0, 200).forEach(function (t) {
      container.appendChild(buildTxItemEl(t, { showDate: true, showAccountTag: accountFilter === 'all' }));
    });
  }

  document.getElementById('searchBtn').addEventListener('click', runSearch);

  document.getElementById('copySearchBtn').addEventListener('click', function () {
    var lines = [];
    lines.push('【Mood Lab 記帳本搜尋結果】');
    lines.push('產生時間：' + todayStr());
    lines.push('共 ' + lastSearchResults.length + ' 筆');
    lines.push('');
    var total = 0;
    lastSearchResults.forEach(function (t) {
      if (t.type === 'transfer') {
        lines.push(t.date + '　轉帳　' + ACCOUNT_NAMES[t.fromAccount] + '→' + ACCOUNT_NAMES[t.toAccount] + '　' + formatMoney(t.amount) + (t.note ? '　' + t.note : ''));
      } else {
        var cat = findCategory(t.type, t.categoryId);
        var sign = t.type === 'income' ? '+' : '-';
        lines.push(t.date + '　' + (t.type === 'income' ? '收入' : '支出') + '｜' + cat.name + '　' + ACCOUNT_NAMES[t.account] + '帳　' + sign + formatMoney(t.amount) + (t.note ? '　' + t.note : ''));
        total += (t.type === 'income' ? t.amount : -t.amount);
      }
    });
    lines.push('');
    lines.push('合計（不含轉帳）：' + formatMoney(total));
    var text = lines.join('\n');

    var btn = this;
    var originalLabel = btn.textContent;
    function showCopied() {
      btn.textContent = '已複製！貼給 AI 就可以了';
      setTimeout(function () { btn.textContent = originalLabel; }, 2000);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(showCopied).catch(function () {
        window.prompt('請手動複製以下文字：', text);
      });
    } else {
      window.prompt('請手動複製以下文字：', text);
    }
  });

  // ---------- Backup export / import ----------
  function exportBackup() {
    var data = JSON.stringify({ transactions: transactions, assetSnapshots: assetSnapshots }, null, 1);
    var blob = new Blob([data], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = '記帳本備份-' + todayStr() + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  document.getElementById('exportBackupBtn').addEventListener('click', exportBackup);

  // ---------- Copy report summary as text (for pasting into an AI chat) ----------
  function buildReportSummaryText() {
    var lines = [];
    var accountLabel = accountFilter === 'all' ? '全部帳戶' : ACCOUNT_NAMES[accountFilter] + '帳';
    lines.push('【Mood Lab 記帳本報表摘要】');
    lines.push('產生時間：' + todayStr());
    lines.push('目前篩選帳戶：' + accountLabel);
    lines.push('');

    var b = computeAccountBalances();
    lines.push('■ 帳戶餘額（累計至今）');
    lines.push('個人帳：' + formatMoney(b.personal));
    lines.push('公司帳：' + formatMoney(b.company));
    lines.push('總計：' + formatMoney(b.personal + b.company));
    lines.push('');

    var byMonth = {};
    transactions.forEach(function (t) {
      if (!txMatchesAccountFilter(t)) return;
      if (rankScope !== 'all' && !rankMatchesScope(t)) return;
      var d = new Date(t.date + 'T00:00:00');
      var key = d.getFullYear() + '-' + pad(d.getMonth() + 1);
      if (!byMonth[key]) byMonth[key] = { income: 0, expense: 0, transfer: 0, incomeCount: 0 };
      if (t.type === 'income') { byMonth[key].income += t.amount; byMonth[key].incomeCount++; }
      else if (t.type === 'expense') byMonth[key].expense += t.amount;
      else if (t.type === 'transfer' && accountFilter !== 'all') {
        if (t.toAccount === accountFilter) byMonth[key].transfer += t.amount;
        if (t.fromAccount === accountFilter) byMonth[key].transfer -= t.amount;
      }
    });
    var monthKeys = Object.keys(byMonth).sort().reverse();
    lines.push('■ 各月統計（' + currentScopeLabel() + '）');
    if (monthKeys.length === 0) {
      lines.push('（還沒有資料）');
    } else {
      monthKeys.forEach(function (key) {
        var m = byMonth[key];
        var row = key + '　收入 +' + formatMoney(m.income) + '　支出 -' + formatMoney(m.expense) + '　結餘 ' + formatMoney(m.income - m.expense) + '　收入交易筆數(來客次數估計) ' + m.incomeCount + '筆';
        if (accountFilter !== 'all' && m.transfer !== 0) {
          row += '　轉帳 ' + (m.transfer >= 0 ? '+' : '') + formatMoney(m.transfer);
        }
        lines.push(row);
      });
    }
    lines.push('');

    var rankTypeLabel = rankType === 'income' ? '收入' : '支出';
    var scopeLabel = currentScopeLabel();
    var selectedCat = rankCategorySelect.value;
    var catLabel = selectedCat ? findCategory(rankType, selectedCat).name + '細項' : '全部分類';
    lines.push('■ 項目排名（' + rankTypeLabel + '｜' + scopeLabel + '｜' + catLabel + '）');

    if (selectedCat) {
      var itemTotals = {}, itemCounts = {}, grandItem = 0;
      transactions.forEach(function (t) {
        if (t.type !== rankType || t.categoryId !== selectedCat) return;
        if (!txMatchesAccountFilter(t)) return;
        if (!rankMatchesScope(t)) return;
        var key = groupingKeyForNote(t.note);
        itemTotals[key] = (itemTotals[key] || 0) + t.amount;
        itemCounts[key] = (itemCounts[key] || 0) + 1;
        grandItem += t.amount;
      });
      var itemRows = Object.keys(itemTotals)
        .map(function (name) { return { name: name, amount: itemTotals[name], count: itemCounts[name] }; })
        .sort(function (a, b) { return b.amount - a.amount; });
      if (itemRows.length === 0) {
        lines.push('（還沒有資料）');
      } else {
        itemRows.forEach(function (r, i) {
          var pct = grandItem ? Math.round((r.amount / grandItem) * 100) : 0;
          lines.push((i + 1) + '. ' + r.name + '（' + r.count + '筆）　' + formatMoney(r.amount) + '　' + pct + '%');
        });
      }
    } else {
      var totals = {}, counts = {}, grand = 0;
      transactions.forEach(function (t) {
        if (t.type !== rankType) return;
        if (!txMatchesAccountFilter(t)) return;
        if (!rankMatchesScope(t)) return;
        totals[t.categoryId] = (totals[t.categoryId] || 0) + t.amount;
        counts[t.categoryId] = (counts[t.categoryId] || 0) + 1;
        grand += t.amount;
      });
      var rows = categoriesFor(rankType)
        .map(function (c) { return { cat: c, amount: totals[c.id] || 0, count: counts[c.id] || 0 }; })
        .filter(function (r) { return r.amount > 0; })
        .sort(function (a, b) { return b.amount - a.amount; });
      if (rows.length === 0) {
        lines.push('（還沒有資料）');
      } else {
        rows.forEach(function (r, i) {
          var pct = grand ? Math.round((r.amount / grand) * 100) : 0;
          lines.push((i + 1) + '. ' + r.cat.name + '（' + r.count + '筆）　' + formatMoney(r.amount) + '　' + pct + '%');
        });
      }
    }
    lines.push('');

    lines.push('■ 品項月趨勢表（' + rankTypeLabel + '｜' + catLabel + '，筆數；固定顯示全部月份，不受時段篩選影響）');
    var tableMatches = transactions.filter(function (t) {
      if (t.type !== rankType) return false;
      if (typeof t.date !== 'string' || t.date.length < 7) return false;
      if (!txMatchesAccountFilter(t)) return false;
      if (selectedCat && t.categoryId !== selectedCat) return false;
      return true;
    });
    if (tableMatches.length === 0) {
      lines.push('（還沒有資料）');
    } else {
      var tRowKeyFor = selectedCat
        ? function (t) { return groupingKeyForNote(t.note); }
        : function (t) { return t.categoryId; };
      var tRowLabelFor = selectedCat
        ? function (key) { return key; }
        : function (key) { var cat = findCategory(rankType, key); return cat.icon + ' ' + cat.name; };

      var tMonthSet = {};
      tableMatches.forEach(function (t) { tMonthSet[t.date.slice(0, 7)] = true; });
      var tMonths = Object.keys(tMonthSet).sort();

      var tCounts = {}, tRowTotals = {};
      tableMatches.forEach(function (t) {
        var key = tRowKeyFor(t);
        var month = t.date.slice(0, 7);
        tCounts[key] = tCounts[key] || {};
        tCounts[key][month] = (tCounts[key][month] || 0) + 1;
        tRowTotals[key] = (tRowTotals[key] || 0) + 1;
      });
      var tRowKeys = Object.keys(tRowTotals).sort(function (a, b) { return tRowTotals[b] - tRowTotals[a]; });

      tRowKeys.forEach(function (key) {
        var parts = tMonths.map(function (m) {
          return m + '=' + ((tCounts[key] && tCounts[key][m]) || 0);
        });
        lines.push(tRowLabelFor(key) + '：' + parts.join('、') + '　合計=' + tRowTotals[key]);
      });
    }

    if (assetSnapshots.length > 0) {
      var latestSnapshot = assetSnapshots.slice().sort(function (a, b) { return a.month < b.month ? 1 : -1; })[0];
      var usStockTwd = (latestSnapshot.usStockUsd || 0) * (latestSnapshot.usdRate || 0);
      var usdDepositTwd = (latestSnapshot.usdDepositUsd || 0) * (latestSnapshot.usdRate || 0);
      var insuranceTwd = (latestSnapshot.insuranceUsd || 0) * (latestSnapshot.usdRate || 0);
      lines.push('');
      lines.push('■ 資產總覽（' + latestSnapshot.month.replace('-', '/') + '）');
      lines.push('存款：' + formatMoney(latestSnapshot.deposits || 0));
      lines.push('股票：' + formatMoney(latestSnapshot.stocks || 0));
      lines.push('基金：' + formatMoney(latestSnapshot.funds || 0));
      lines.push('美股：US' + formatMoney(latestSnapshot.usStockUsd || 0) + '（約台幣 ' + formatMoney(usStockTwd) + '）');
      lines.push('外幣美元存款：US' + formatMoney(latestSnapshot.usdDepositUsd || 0) + '（約台幣 ' + formatMoney(usdDepositTwd) + '）');
      lines.push('保險（美金保單）：US' + formatMoney(latestSnapshot.insuranceUsd || 0) + '（約台幣 ' + formatMoney(insuranceTwd) + '）');
      lines.push('總淨值：' + formatMoney(assetSnapshotTotal(latestSnapshot)));
    }

    return lines.join('\n');
  }

  document.getElementById('copySummaryBtn').addEventListener('click', function () {
    var text = buildReportSummaryText();
    var btn = document.getElementById('copySummaryBtn');
    var originalLabel = btn.textContent;
    function showCopied() {
      btn.textContent = '已複製！貼給 AI 就可以了';
      setTimeout(function () { btn.textContent = originalLabel; }, 2000);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(showCopied).catch(function () {
        window.prompt('請手動複製以下文字：', text);
      });
    } else {
      window.prompt('請手動複製以下文字：', text);
    }
  });

  document.getElementById('importBackupBtn').addEventListener('click', function () {
    document.getElementById('importFileInput').click();
  });

  document.getElementById('importFileInput').addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var data, newTransactions, newAssetSnapshots;
      try {
        data = JSON.parse(reader.result);
        if (Array.isArray(data)) {
          newTransactions = data;
          newAssetSnapshots = null;
        } else if (data && Array.isArray(data.transactions)) {
          newTransactions = data.transactions;
          newAssetSnapshots = Array.isArray(data.assetSnapshots) ? data.assetSnapshots : [];
        } else {
          throw new Error('unrecognized format');
        }
      } catch (err) {
        alert('匯入失敗：檔案格式不正確');
        return;
      }
      var confirmMsg = '匯入將會取代目前 App 裡所有的記帳資料（共 ' + newTransactions.length + ' 筆）';
      confirmMsg += newAssetSnapshots ? '與資產快照（共 ' + newAssetSnapshots.length + ' 筆），確定要繼續嗎？' : '，確定要繼續嗎？';
      var ok = confirm(confirmMsg);
      if (!ok) return;
      transactions = newTransactions;
      persist();
      if (newAssetSnapshots) {
        assetSnapshots = newAssetSnapshots;
        persistAssets();
        renderAssetView();
      }
      renderAll();
      openReport();
      alert('匯入完成！');
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  function openReport() {
    monthlyTrendExpanded = false;
    renderReportBalances();
    renderMonthlyTrend();
    rankScope = 'all';
    rankScopeBtns.forEach(function (b) {
      var active = b.dataset.scope === 'all';
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    updateRankScopeInputsVisibility();
    rankMonthInput.value = currentMonth.getFullYear() + '-' + pad(currentMonth.getMonth() + 1);
    rankRangeFrom.value = '';
    rankRangeTo.value = '';
    populateRankCategorySelect();
    renderRanking();
    renderItemMonthTable();
    document.getElementById('searchKeyword').value = '';
    document.getElementById('searchAmountMin').value = '';
    document.getElementById('searchAmountMax').value = '';
    document.getElementById('searchDateFrom').value = '';
    document.getElementById('searchDateTo').value = '';
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('searchEmpty').hidden = true;
    reportBackdrop.hidden = false;
  }

  document.getElementById('openReportBtn').addEventListener('click', openReport);
  document.getElementById('reportClose').addEventListener('click', function () { reportBackdrop.hidden = true; });
  reportBackdrop.addEventListener('click', function (e) {
    if (e.target === reportBackdrop) reportBackdrop.hidden = true;
  });

  // ---------- Init ----------
  renderAll();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
