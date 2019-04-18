// jQuery for validation


$(function () {

    $("#userForm").validate({
        rules: {
            name: {
                required: true,
                minlength: 2,
            },
            state: {
                required: "",
            },
            income: {
                required: true,
                maxlength: 10,
            },
        },

        //validation error message
        messag: {
            name: "please enter your firstname",
            state: "",
            income: {
                required: "Please enter your income.",
                maxlength: "Cannot be more than 9 digits. Please do not use commas.",
            },
        }
    });

    $("#form").validate();
});