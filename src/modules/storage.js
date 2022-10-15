const Storage = (function () {
  function update(array) {
    localStorage.setItem('projects', JSON.stringify(array));
  }

  const get = () => {
    if (localStorage.getItem('projects')) {
      return JSON.parse(localStorage.getItem('projects'));
    }
  };

  return { update, get };
}());

export { Storage };
