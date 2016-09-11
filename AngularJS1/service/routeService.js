"user strict"

exports.getAllList = function getAllList(req, response) {

    var listBookServer= [
        {
            "isbn": "c8fabf68-8374-48fe-a7ea-a00ccd07afff",
            "title": "Henri Potter à l'école des sorciers",
            "price": 35,
            "cover": "http://localhost:8085//img/hp0.jpg"
        },
        {
            "isbn": "a460afed-e5e7-4e39-a39d-c885c05db861",
            "title": "Henri Potter et la Chambre des secrets",
            "price": 30,
            "cover": "http://localhost:8085/img/hp1.jpg"
        },
        {
            "isbn": "fcd1e6fa-a63f-4f75-9da4-b560020b6acc",
            "title": "Henri Potter et le Prisonnier d'Azkaban",
            "price": 30,
            "cover": "http://localhost:8085/img/hp2.jpg"
        },
        {
            "isbn": "c30968db-cb1d-442e-ad0f-80e37c077f89",
            "title": "Henri Potter et la Coupe de feu",
            "price": 29,
            "cover": "http://localhost:8085/img/hp3.jpg"
        },
        {
            "isbn": "78ee5f25-b84f-45f7-bf33-6c7b30f1b502",
            "title": "Henri Potter et l'Ordre du phénix",
            "price": 28,
            "cover": "http://localhost:8085/img/hp4.jpg"
        },
        {
            "isbn": "cef179f2-7cbc-41d6-94ca-ecd23d9f7fd6",
            "title": "Henri Potter et le Prince de sang-mélé",
            "price": 30,
            "cover": "http://localhost:8085/img/hp5.jpg"
        },
        {
            "isbn": "bbcee412-be64-4a0c-bf1e-315977acd924",
            "title": "Henri Potter et les Reliques de la Mort",
            "price": 35,
            "cover": "http://localhost:8085/img/hp6.jpg"
        }
    ];

    response.end(JSON.stringify(listBookServer));
};




exports.getOffre = function getOffre(req, response) {
    console.log(req.params.idisbn);
    var offreBook = [{
        "offers": [{
            "type": "percentage",
            "value": 8
        },
            {
                "type": "minus",
                "value": 30
            },
            {
                "type": "slice",
                "sliceValue": 80,
                "value": 14
            }
        ]
    }, {
        "offers": [
            {
                "type": "percentage",
                "value": 4
            },
            {
                "type": "minus",
                "value": 15
            },
            {
                "type": "slice",
                "sliceValue": 100,
                "value": 12
            }
        ]
    }, {
        "offers": [
            {
                "type": "percentage",
                "value": 4
            }
        ]
    }];
    var nbIdIsbn=req.params.idisbn.split(",").length;
   if(nbIdIsbn==1){
       response.end(JSON.stringify(offreBook[2]));
    }else{
        if(nbIdIsbn>1 && nbIdIsbn<4){
            response.end(JSON.stringify(offreBook[1]));

        }else{
            if(nbIdIsbn>3){
                response.end(JSON.stringify(offreBook[0]));
            }
        }
    }
};