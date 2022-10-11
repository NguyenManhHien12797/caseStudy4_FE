function sendMail() {
    let email = $("#email").val()
    let appUser = {
        "email": email
    };
    $.ajax({
        type: "POST",
        headers: {
            //kiểu dữ liệu nhận về
            // Accept: "application/json",
            // kiểu truyền đi
            "Content-Type": "application/json"
        },
        url: "http://localhost:8080/mail/forgotpass",
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