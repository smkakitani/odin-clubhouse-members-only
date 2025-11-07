const indexHomeGet = (req, res) => {
  // res.render("index", {
  //      title: "Clubhouse"
  //   // links:  links,
  // });
  res.send('~Clubhouse!!!~');
};

module.exports = {
  indexHomeGet,
};