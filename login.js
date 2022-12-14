function login() {
    let username = $("#username").val();
    let password = $("#password").val();

    let appUser = {
        userName: username,
        password: password
    };

    $.ajax({
        type: "POST",
        headers: {
            //kiểu dữ liệu nhận về
            // 'Accept': 'application/json',
            // kiểu truyền đi
            "Content-Type": "application/json"
        },
        url: "http://localhost:8080/login",
        data: JSON.stringify(appUser),
        //xử lý khi thành công
        success: function (data) {

            localStorage.setItem("token", data.token);
            localStorage.setItem("data",JSON.stringify(data));
            localStorage.setItem("userName",username);
            location.href = "home.html";
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function keydownLoginHandler(evt){
    if(evt.keyCode==13){
        login()
    }
}

