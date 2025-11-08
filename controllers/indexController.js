const indexHomeGet = (req, res) => {
  res.render("index", {
    title: "Neko House",
  });
  // res.send('~Clubhouse!!!~');
};

module.exports = {
  indexHomeGet,
};