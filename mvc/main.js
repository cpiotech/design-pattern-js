// Model 
var Model = function Model(XMLHttpRequest) {
  this.XMLHttpRequest = XMLHttpRequest;
};

Model.prototype.getPenguin = function getPenguin(index, cb) {
  var oReq = new this.XMLHttpRequest();

  oReq.onload = function onLoad(e) {
    var response = JSON.parse(e.currentTarget.responseText);
    var penguin = response[index];

    penguin.index = index;
    penguin.count = response.length;

    cb(penguin);
  }

  oReq.open('GET', 'https://codepen.io/beautifulcoder/pen/vmOOLr.js');
  oReq.send();
};

// View
var View = function View(element) {
  this.element = element;
  this.onClickGetPenguin = null;
};

View.prototype.render = function render(model) {
  this.element.innerHTML = '<h3>' + model.name + '</h3>' +
    '<img class="penguin-image" src="' + model.imageURL +
      '" alt="' + model.name + '" />' +
    '<p><b>Size:</b> ' + model.size + '</p>' +
    '<p><b>Favorite food:</b> ' + model.favoriteFood + '</p>' +
    '<a id="prev" class="previous button" href="javascript:void(0);"' +
      ' data-penguin-index="' + model.prevIndex + '">Previous</a> ' +
    '<a id="next" class="next button" href="javascript:void(0);"' +
      ' data-penguin-index="' + model.nextIndex + '">Next</a>';

  this.prevIndex = model.prevIndex;
  this.nextIndex = model.nextIndex;

  var prev = this.element.querySelector('#prev');
  prev.addEventListener('click', this.onClickGetPenguin);

  var next = this.element.querySelector('#next');
  next.addEventListener('click', this.onClickGetPenguin);
};

// Controller
var Controller = function Controller(view, model) {
  this.view = view;
  this.model = model;
};

Controller.prototype.init = function init() {
  this.view.onClickGetPenguin = this.onClickGetPenguin.bind(this);
}

Controller.prototype.onClickGetPenguin = function onClickGetPenguin(e) {
  var target = e.currentTarget;
  var index = parseInt(target.dataset.penguinIndex, 10);

  this.model.getPenguin(index, this.showPenguin.bind(this));
}

Controller.prototype.showPenguin = function showPenguin(data) {
  var model = {
    name: data.name,
    imageURL : data.imageUrl,
    size: data.size,
    favoriteFood: data.favoriteFood
  };

  model.prevIndex = data.index - 1;
  model.nextIndex = data.index + 1;

  if (data.index === 0) {
    model.prevIndex = data.count - 1;
  }
  if (data.index === data.count - 1) {
    model.nextIndex = 0;
  }

  this.view.render(model);
}

var model = new Model(XMLHttpRequest);

var targetElement = document.getElementById('list');
var view = new View(targetElement);

var controller = new Controller(view, model);

controller.init();
controller.onClickGetPenguin({ currentTarget: { dataset: { penguinIndex: 0 } } });
