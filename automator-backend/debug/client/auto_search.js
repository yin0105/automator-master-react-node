/**
  ! DEBUG TOOL

  Please run this code on
    https://login.cridb.com/crid/main
  when you debug.

  Then, when you typing new keyword for searching,
  or press space-bar and search keyword is exists,
  browser will automatically search with new keyword.
*/

(() => {
  const targetList = ['thing', 'event', 'medium'];

  function $(q) {
    return document.querySelector(q);
  }

  targetList.forEach((q) => {
    let timer;
    const form = $(`.box.${q} form`),
      queryInput = form.querySelector('input[name=query]'),
      searchBtn = form.querySelector('input[type=submit]');
    queryInput.addEventListener('keydown', () => {
      if (!queryInput.value.trim()) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        searchBtn.click();
      }, 350);
    });
  });

  window.addEventListener('keydown', (event) => {
    if (event.key.trim()) return;
    targetList.forEach((q) => {
      const form = $(`.box.${q} form`),
        queryInput = form.querySelector('input[name=query]'),
        searchBtn = form.querySelector('input[type=submit]');

      if (queryInput.value.trim()) searchBtn.click();
    });
  });
})();
