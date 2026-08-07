(function () {
  'use strict';

  var STORAGE_KEY = 'ledger_transactions_v3';

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
        { name: '睫毛管理+野生眉雕塑', price: 3500 },
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
        { name: '店租', price: 38000, account: 'company' },
        { name: '店面管理費', price: 2080, account: 'company' },
        { name: '家裡房租', price: 24000, account: 'personal' },
        { name: '家裡管理費', price: 17000, account: 'personal' }
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
    }
  ];

  var QUICKPICKS = {
    service: { label: '服務項目（選填，自動帶入品名與金額）', groups: SERVICE_ITEM_GROUPS },
    sublease: { label: '分租項目（選填，自動帶入品名與金額）', groups: SUBLEASE_GROUPS },
    home: { label: '固定支出（選填，自動帶入品名、金額與帳戶）', groups: HOME_EXPENSE_GROUPS },
    other_expense: { label: '固定支出（選填，自動帶入品名、金額與帳戶）', groups: OTHER_EXPENSE_GROUPS }
  };

  function buildSeedTransactions() {
    var source = window.SEED_TRANSACTIONS || [];
    return source.map(function (t) { return Object.assign({}, t); });
  }

  // ---------- State ----------
  var transactions = load();
  var currentMonth = new Date();
  currentMonth.setDate(1);
  var activeTab = 'listView';
  var statsType = 'expense';
  var modalType = 'expense';
  var modalAccount = 'personal';
  var selectedCategoryId = null;
  var editingId = null;
  var accountFilter = localStorage.getItem('ledger_account_filter') || 'all';

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
      var header = document.createElement('div');
      header.className = 'tx-day-header';
      header.textContent = (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + WEEKDAYS[d.getDay()];
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
    amountInput.value = item.price;
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

  function updateCommissionCalc() {
    var base = parseFloat(commissionBaseInput.value) || 0;
    var rateRaw = parseFloat(commissionRateInput.value);
    var rate = isNaN(rateRaw) ? 30 : rateRaw;
    var computed = Math.round(base * rate / 100);
    amountInput.value = computed || '';
    var partner = commissionPartnerInput.value.trim();
    noteInput.value = (partner ? partner + '｜' : '') + '抽成分潤（客人消費$' + base.toLocaleString() + ' × ' + rate + '%）';
  }
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

  // ---------- Report sheet ----------
  var reportBackdrop = document.getElementById('reportBackdrop');
  var rankType = 'expense';
  var rankScope = 'all';

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

  function renderMonthlyTrend() {
    var byMonth = {};
    transactions.forEach(function (t) {
      if (!txMatchesAccountFilter(t)) return;
      var d = new Date(t.date + 'T00:00:00');
      var key = d.getFullYear() + '-' + pad(d.getMonth() + 1);
      if (!byMonth[key]) byMonth[key] = { income: 0, expense: 0, transfer: 0, year: d.getFullYear(), month: d.getMonth() + 1 };
      if (t.type === 'income') byMonth[key].income += t.amount;
      else if (t.type === 'expense') byMonth[key].expense += t.amount;
      else if (t.type === 'transfer' && accountFilter !== 'all') {
        if (t.toAccount === accountFilter) byMonth[key].transfer += t.amount;
        if (t.fromAccount === accountFilter) byMonth[key].transfer -= t.amount;
      }
    });
    var keys = Object.keys(byMonth).sort().reverse();
    var container = document.getElementById('monthlyTrendList');
    container.innerHTML = '';
    if (keys.length === 0) {
      container.innerHTML = '<p class="empty-state">還沒有資料</p>';
      return;
    }
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
      if (accountFilter !== 'all' && m.transfer !== 0) {
        html += '<span class="report-trend-transfer">轉帳 ' + (m.transfer >= 0 ? '+' : '') + formatMoney(m.transfer) + '</span>';
      }
      row.innerHTML = html;
      container.appendChild(row);
    });
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

    if (selectedCat) {
      // Item-level breakdown within one category, grouped by note text.
      var itemTotals = {};
      var itemCounts = {};
      var grandItem = 0;
      transactions.forEach(function (t) {
        if (t.type !== rankType || t.categoryId !== selectedCat) return;
        if (!txMatchesAccountFilter(t)) return;
        if (!rankMatchesScope(t)) return;
        var key = t.note && t.note.trim() ? t.note.trim() : '（無備註）';
        itemTotals[key] = (itemTotals[key] || 0) + t.amount;
        itemCounts[key] = (itemCounts[key] || 0) + 1;
        grandItem += t.amount;
      });
      var itemRows = Object.keys(itemTotals)
        .map(function (name) { return { name: name, amount: itemTotals[name], count: itemCounts[name] }; })
        .sort(function (a, b) { return b.amount - a.amount; });

      var list = document.getElementById('rankList');
      list.innerHTML = '';
      if (itemRows.length === 0) {
        list.innerHTML = '<p class="empty-state">還沒有資料</p>';
        return;
      }
      itemRows.forEach(function (r, i) {
        var pct = grandItem ? Math.round((r.amount / grandItem) * 100) : 0;
        var li = document.createElement('li');
        li.className = 'legend-item';
        li.innerHTML =
          '<span class="legend-swatch" style="background:var(--brand-accent)"></span>' +
          '<span class="legend-name">' + (i + 1) + '. ' + r.name + '（' + r.count + '筆）</span>' +
          '<span class="legend-pct">' + pct + '%</span>' +
          '<span class="legend-amount">' + formatMoney(r.amount) + '</span>';
        list.appendChild(li);
      });
      return;
    }

    var totals = {};
    var grand = 0;
    transactions.forEach(function (t) {
      if (t.type !== rankType) return;
      if (!txMatchesAccountFilter(t)) return;
      if (!rankMatchesScope(t)) return;
      totals[t.categoryId] = (totals[t.categoryId] || 0) + t.amount;
      grand += t.amount;
    });
    var cats = categoriesFor(rankType);
    var rows = cats
      .map(function (c) { return { cat: c, amount: totals[c.id] || 0 }; })
      .filter(function (r) { return r.amount > 0; })
      .sort(function (a, b) { return b.amount - a.amount; });

    var list2 = document.getElementById('rankList');
    list2.innerHTML = '';
    if (rows.length === 0) {
      list2.innerHTML = '<p class="empty-state">還沒有資料</p>';
      return;
    }
    rows.forEach(function (r, i) {
      var pct = grand ? Math.round((r.amount / grand) * 100) : 0;
      var li = document.createElement('li');
      li.className = 'legend-item';
      li.innerHTML =
        '<span class="legend-swatch" style="background:var(' + r.cat.color + ')"></span>' +
        '<span class="legend-name">' + (i + 1) + '. ' + r.cat.icon + ' ' + r.cat.name + '</span>' +
        '<span class="legend-pct">' + pct + '%</span>' +
        '<span class="legend-amount">' + formatMoney(r.amount) + '</span>';
      list2.appendChild(li);
    });
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
    });
  });

  rankCategorySelect.addEventListener('change', renderRanking);

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
    });
  });

  rankMonthInput.addEventListener('change', renderRanking);
  rankRangeFrom.addEventListener('change', renderRanking);
  rankRangeTo.addEventListener('change', renderRanking);

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

    var container = document.getElementById('searchResults');
    var emptyEl = document.getElementById('searchEmpty');
    container.innerHTML = '';
    if (results.length === 0) {
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;
    results.slice(0, 200).forEach(function (t) {
      container.appendChild(buildTxItemEl(t, { showDate: true, showAccountTag: accountFilter === 'all' }));
    });
  }

  document.getElementById('searchBtn').addEventListener('click', runSearch);

  // ---------- Backup export / import ----------
  function exportBackup() {
    var data = JSON.stringify(transactions, null, 1);
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

  document.getElementById('importBackupBtn').addEventListener('click', function () {
    document.getElementById('importFileInput').click();
  });

  document.getElementById('importFileInput').addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var data;
      try {
        data = JSON.parse(reader.result);
        if (!Array.isArray(data)) throw new Error('not an array');
      } catch (err) {
        alert('匯入失敗：檔案格式不正確');
        return;
      }
      var ok = confirm('匯入將會取代目前 App 裡所有的記帳資料（共 ' + data.length + ' 筆），確定要繼續嗎？');
      if (!ok) return;
      transactions = data;
      persist();
      renderAll();
      openReport();
      alert('匯入完成！');
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  function openReport() {
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
