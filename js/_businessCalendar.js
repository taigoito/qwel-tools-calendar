/**
 * Business Calendar
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

import Calendar from './_calendar.js';

export default class BusinessCalendar extends Calendar {
  async makeCalendar(year, month) {
    super.makeCalendar(year, month);

    // データを取得して、状態値を反映
    const url = this.options.url;
    const res = await fetch(`${url}php/api.php?method=fetch&year=${year}&month=${month + 1}`);
    const data = await res.json();
    console.log(data);
    this._setStatus(data);
  }

  _handleEvents() {
    super._handleEvents();

    // モードの選択受付
    const mode = document.querySelector('.calendar__mode');
    if (!mode) return;
    mode.addEventListener('change', () => {
      this._elem.classList.toggle('--editMode');
    });

    // セルのデータ操作受付
    this._body.addEventListener('click', (event) => this._cellClickHandler(event));
  }

  _setStatus(data) {
    const elems = this._body.querySelectorAll('[data-date]');
    elems.forEach((td) => {
      const date = td.dataset.date;
      const week = td.dataset.week;

      // 週のデフォルト値
      let state = 2;

      // データがあれば、状態値を上書き
      data.forEach((dt) => {
        if (dt.date == date) state = dt.state;
      });

      td.dataset.state = state;
    });
  }

  _cellClickHandler(event) {
    // 編集モード時のみ受付
    if (!(this._elem.classList.contains('--editMode'))) return;

    // 状態値を更新
    const target = event.target;
    let state = target.dataset.state;
    state = (state + 1) % 3;
    target.dataset.state = state;

    // データの更新をPUT
    const url = this.options.url;
    const date = target.dataset.date;

    if (date) {
      const postData = new FormData;
      postData.set('date', date);
      postData.set('state', state);

      fetch(`${url}php/api.php?method=insert`, {
        method: 'POST',
        body: postData
      });
    }
  }
}
