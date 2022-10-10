function register() {
    let username = $("#username").val();
    let password = $("#password").val();
    let email = $("#email").val();

    let appUser = {
        userName: username,
        password: password,
        email: email
    };

    $.ajax({
        type: "POST",
        headers: {
            //kiểu dữ liệu nhận về
            // Accept: "application/json",
            // kiểu truyền đi
            "Content-Type": "application/json"
        },
        url: "http://localhost:8080/api/users/register",
        data: JSON.stringify(appUser),
        //xử lý khi thành công
        success: function () {
            location.href = "index.html";
        },
        error: function (err) {
            location.href = "error.html";
        }
    });
}
