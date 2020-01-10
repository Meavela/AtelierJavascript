// add the score of the person to the database
export function AddData(person, timePlay, score, db) {
    // send the data to database
    db.collection("scores").add({
        name: person,
        timePlay: timePlay,
        score: score
    })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}

// read all the score of the database and display it
export function ReadData(db) {
    // remove the tbody already existing
    $("#displayScore").remove();

    // create a new tbody empty
    var tbody = '<tbody id="displayScore"></tbody>';
    $("#scores").append(tbody);

    var count = 1;
    // read all the data of database and display it in the tbody
    db.collection("scores").orderBy("score", "desc").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc != null) {
                var datas = doc.data();
                var result = "";
                result += '<tr><th scope="row">' + count + '</th>';
                result += '<td>' + datas.name + '</td>';
                result += '<td>' + datas.timePlay + '</td>';
                result += '<td>' + datas.score + '</td>';
                result += '</tr>';

                count++;
                $("#displayScore").append(result);
            }
        });
    });
}
