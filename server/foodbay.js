var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var assert = require('assert');
var request = require('request');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var findCanteen = function(db, callback) {
  var collection = db.collection('canteen');

  collection.find().toArray(function(err, result) {
    assert.equal(err, null);
    console.log("Found the following CANTEEN records");
    callback(result);
  });
}

var findAllUser = function(db, callback) {
  var collection = db.collection('user');

  collection.find().toArray(function(err, result) {
    assert.equal(err, null);
    console.log("Found the following USER records");
    callback(result);
  });
}

var findFood = function(db, callback) {
  var collection = db.collection('food');

  collection.find().toArray(function(err, result) {
    assert.equal(err, null);
    console.log("Found the following FOOD records");
    callback(result);
  });
}

var searchFood = function(db, para, callback) {
  var collection = db.collection('food');

  collection.find({'name': { $regex: para.name } }).toArray(function(err, result) {
    assert.equal(err, null);
    console.log("Found the following FOOD records");
    callback(result);
  });
}

//获取一些信息
var getInfo = function(db, key, callback) {
  var collection = db.collection('info');

  collection.find({'key': key}).toArray(function(err, result) {
    assert.equal(err, null);
    console.log("Found the following INFO records");
    callback(result[0].value);
  });
}

var deleteCanteen = function(db, place, callback) {
  var collection = db.collection('canteen');

  collection.remove({'_id': ObjectId(place._id)}, function(err) {
    assert.equal(err, null);
    console.log("Delete the canteen successfully");
    callback();
  });
}

var deleteFood = function(db, food, callback) {
  var collection = db.collection('food');

  collection.remove({'_id': ObjectId(food._id)}, function(err) {
    assert.equal(err, null);
    console.log("Delete the food successfully");
    callback();
  });
}

var deleteUser = function(db, usr, callback) {
  var collection = db.collection('user');

  collection.remove({'userId': usr.userId}, function(err) {
    assert.equal(err, null);
    console.log("Delete the user successfully");
    callback();
  });
}

var upsertCanteen = function(db, place, callback) {
  var collection = db.collection('canteen');

  if (place._id) {
    collection.update({'_id': ObjectId(place._id)}, {$set:{'title': place.title, "information": place.information}}, function(err) {
      assert.equal(err, null);
      console.log("Update the canteen successfully");
      callback();
    });
  } else {
    collection.insert({'title': place.title, "information": place.information}, function(err) {
      assert.equal(err, null);
      console.log("Insert the canteen successfully");
      callback();
    });
  }
}

var upsertFood = function(db, food, callback) {
  var collection = db.collection('food');

  if (food._id) {
    collection.update({'_id': ObjectId(food._id)}, {$set:{"name": food.name, "pic": food.pic, "place": food.place, "area": food.area, "price": food.price, "rate": food.rate}}, function(err) {
      assert.equal(err, null);
      console.log("Update the food successfully");
      callback();
    });
  } else {
    collection.insert({"name": food.name, "pic": food.pic, "place": food.place, "area": food.area, "price": food.price, "rate": food.rate}, function(err) {
      assert.equal(err, null);
      console.log("Insert the food successfully");
      callback();
    });
  }
}

var findUser = function(db, user, callback) {
  var collection = db.collection('user');

  if (!user.id) {
    callback(null);
  } else {
    collection.find({'userId': user.id}).toArray(function(err, result) {
      assert.equal(err, null);
      if (result != '') {
        console.log("Found the user");
        callback(result);
      } else {
        collection.insertOne({'userId': user.id, 'info': user.info, 'checked': ['鸿博园食堂', '万秀园食堂'], 'dishes': []}, function(err, result) {
          assert.equal(err, null);
          console.log("Inserted the user successfully");
          collection.find({'userId': user.id}).toArray(function(err, result) {
            assert.equal(err, null);
            callback(result);
          });
        });
      }
    });
  }
}

var updateUserCanteen = function(db, info, callback) {
  var collection = db.collection('user');

  collection.updateOne({'userId': info.id}, {$set: {'checked': info.checked}}, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the userCanteen");
    callback();
  });
}

var updateUserFood = function(db, info, callback) {
  var collection = db.collection('user');

  collection.updateOne({'userId': info.id}, {$set: {'dishes': info.dishes}}, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the userFood");
    callback();
  });
}

//for update seat status
var updateSeatStatus = function(db, food, status, callback) {
  var collection = db.collection('food');

  collection.update({'_id': ObjectId(food._id)}, {$set:{"rate.seat": status}}, function(err) {
    assert.equal(err, null);
    callback();
  });
}

//for update seat status
var findStatusFromCanteen = function(db, title, area, callback) {
  var date = new Date();
  var status = (date.getMinutes() < 30) ? date.getHours() * 2 : date.getHours() * 2 + 1;
  var collection = db.collection('canteen');

  collection.find({'title': title}).toArray(function(err, result) {
    if (result[0] !== undefined) {
      for (let i in result[0].information) {
        if (result[0].information[i].area === area) callback(result[0].information[i].state[status]);
      }
    }
    assert.equal(err, null);
  });
}

var url = 'mongodb://localhost:27017/foodbay'; //updated

//app
var appid = 'xxx'; //updated
var secret = 'xxx'; //updated

//update seat status
setInterval(function() {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    findFood(db, function(food) {
      for (let i in food) {
        findStatusFromCanteen(db, food[i].place, food[i].area, function(result){
          var statusCount;
          if (result == 0) {
            statusCount = 1;
          } else {
            statusCount = Math.round(result / 2);
          }
          updateSeatStatus(db, food[i], statusCount, function() {})
        });

      }
    })

  });
  console.log("update the seat status of foods successfully!")
}, 5 * 60 * 1000);

//http GET POST
app.get('/', function (req, res) {
  console.log(req.ip);
  res.send('Hello ShiBei!');
});

app.post('/getUserOpenId', function(req, res) {
  request('https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + req.body.code + '&grant_type=authorization_code', function (error, response, data) {
    openid = eval('(' + data + ')').openid;
    res.json({'openid': openid});
  });
})

app.post('/getUserCanteen', function(req, res) {
  var user = req.body;
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    findUser(db, user, function(usr) {
      if (!usr) {
        res.json(null);
        db.close();
      } else {
        var checkedPlace = usr[0].checked; //
        findCanteen(db, function(docs) {
          res.json({'place': docs, 'checked': checkedPlace});
          db.close();
        });
      }
    })
  });
});

app.post('/updateUserCanteen', function (req, res) {
  var info = req.body;
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    updateUserCanteen(db, info, function() {
      res.send('success');
      db.close();
    });
  });
});

app.post('/getUserFood', function(req, res) {
  var user = req.body;
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    findUser(db, user, function(usr) {
      if (!usr) {
        res.json(null);
        db.close();
      } else {
        var dishes = usr[0].dishes; //
        findFood(db, function(docs) {
          var food = [];
          for (i in dishes) {
            for (j in docs) {
              if (dishes[i] === docs[j].name)
              food.push(docs[j]);
            }
          }
          res.json({'food': food});
          db.close();
        });
      }
    })
  });
});

app.post('/updateUserFood', function (req, res) {
  var info = req.body;
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    updateUserFood(db, info, function() {
      res.send('success');
      db.close();
    });
  });
});

app.get('/getFoodFromFM', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    findFood(db, function(docs) {
      docs.sort(function (a, b) {
        return Math.random() > 0.5 ? -1 : 1;
      })
      res.json({'food': docs.slice(0, 4)});
      db.close();
    });
  })
});

app.get('/getRandomFood', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    findFood(db, function(docs) {
      docs.sort(function (a, b) {
        return Math.random() > 0.5 ? -1 : 1;
      })
      res.json({'food': docs[0]});
      db.close();
    });
  })
});

app.get('/searchFood', function (req, res) {
  var para = req.query;
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    searchFood(db, para, function(docs) {
      res.json({'food': docs});
      db.close();
    });
  })
});

app.get('/getHotTag', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    getInfo(db, 'hottag', function(docs) {
      res.json({'hottag': docs});
      db.close();
    });
  })
})

// -- For后台管理 --

app.get('/getAllPlace', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    findCanteen(db, function(docs) {
      res.json({'place': docs});
      db.close();
    });
  })
});

app.get('/getAllUser', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    findAllUser(db, function(docs) {
      res.json({'user': docs});
      db.close();
    });
  })
});

app.get('/getAllFood', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    findFood(db, function(docs) {
      res.json({'food': docs});
      db.close();
    });
  })
});

app.post('/upsertCanteen', function (req,res) {
  var place = req.body;
  console.log(place);
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    upsertCanteen(db, place, function() {
      res.send('success');
      db.close();
    })
  });
});

app.post('/deleteCanteen', function (req, res) {
  var place = req.body;
  console.log(place);
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    deleteCanteen(db, place, function() {
      res.send('success');
      db.close();
    })
  });
});

app.post('/upsertFood', function (req,res) {
  var food = req.body;
  console.log(food);
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    upsertFood(db, food, function() {
      res.send('success');
      db.close();
    })
  });
});

app.post('/deleteFood', function (req, res) {
  var food = req.body;
  console.log(food);
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    deleteFood(db, food, function() {
      res.send('success');
      db.close();
    })
  });
});

app.post('/deleteUser', function (req, res) {
  var usr = req.body;
  console.log(usr);
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    deleteUser(db, usr, function() {
      res.send('success');
      db.close();
    })
  });
});

app.use(express.static('client'));

app.get('/manage', function (req, res) {
  res.sendFile(__dirname + "/client/index.html");
});

app.listen(3000, function() {
  console.log('app listening on port 3000!')
});
