const indexHomeGet = (req, res) => {
  res.render("index", {
    title: "Neko House",
    user: req.user,
  });
  // res.send('~Clubhouse!!!~');
};

module.exports = {
  indexHomeGet,
};