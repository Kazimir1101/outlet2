$(document).ready(function () {


    /* =====================================================
       VARIABLES
    ====================================================== */

    let selectedFiles = [];



    /* =====================================================
       IMAGE SELECT
    ====================================================== */

    $("#productImages").on("change", function () {

        const files =
            Array.from(this.files);

        selectedFiles = files;

        renderImagePreview();

    });



    /* =====================================================
       IMAGE PREVIEW
    ====================================================== */

    function renderImagePreview() {

        const preview =
            $(".image-preview");


        preview.empty();


        if (selectedFiles.length === 0) {

            preview.removeClass("active");

            return;
        }


        preview.addClass("active");


        selectedFiles.forEach(function (file, index) {

            const reader =
                new FileReader();


            reader.onload = function (e) {

                const item = $(`
                    <div class="preview-item">

                        <img
                            src="${e.target.result}"
                            alt="Məhsul şəkli">

                        <button
                            type="button"
                            class="preview-remove"
                            data-index="${index}">

                            <i class="fa-solid fa-xmark"></i>

                        </button>

                    </div>
                `);


                preview.append(item);

            };


            reader.readAsDataURL(file);

        });

    }



    /* =====================================================
       REMOVE IMAGE
    ====================================================== */

    $(document).on(
        "click",
        ".preview-remove",
        function (e) {

            e.preventDefault();

            e.stopPropagation();


            const index =
                Number(
                    $(this).attr("data-index")
                );


            selectedFiles.splice(index, 1);


            updateFileInput();

            renderImagePreview();


            if (selectedFiles.length > 0) {

                const group =
                    $("#productImages")
                        .closest(".form-group");


                group.removeClass(
                    "has-error"
                );


                group.find(".form-error")
                    .text("");

            }

        }
    );



    /* =====================================================
       UPDATE FILE INPUT
    ====================================================== */

    function updateFileInput() {

        const dataTransfer =
            new DataTransfer();


        selectedFiles.forEach(function (file) {

            dataTransfer.items.add(file);

        });


        $("#productImages")[0].files =
            dataTransfer.files;

    }



    /* =====================================================
       PHONE FORMAT
       050 123 45 67
    ====================================================== */

    $("#phone").on("input", function () {

        let value =
            $(this)
                .val()
                .replace(/\D/g, "")
                .substring(0, 10);


        let formatted = "";


        if (value.length > 0) {

            formatted +=
                value.substring(0, 3);

        }


        if (value.length > 3) {

            formatted +=
                " " +
                value.substring(3, 6);

        }


        if (value.length > 6) {

            formatted +=
                " " +
                value.substring(6, 8);

        }


        if (value.length > 8) {

            formatted +=
                " " +
                value.substring(8, 10);

        }


        $(this).val(formatted);

    });



    /* =====================================================
       PRODUCT DESCRIPTION
    ====================================================== */

    $("#productFullInfo").on(
        "keydown",
        function (e) {

            /*
             * Enter düyməsini deaktiv edirik.
             */

            if (e.key === "Enter") {

                e.preventDefault();

            }

        }
    );


    $("#productFullInfo").on(
        "input",
        function () {

            const maxLength = 150;


            let value =
                $(this).val();


            /*
             * Yeni sətirləri boşluqla əvəz edirik.
             */

            value =
                value.replace(
                    /[\r\n]+/g,
                    " "
                );


            /*
             * Maksimum 150 simvol.
             */

            if (
                value.length >
                maxLength
            ) {

                value =
                    value.substring(
                        0,
                        maxLength
                    );

            }


            $(this).val(value);

        }
    );



    /* =====================================================
       CUSTOM CITY SELECT
    ====================================================== */


    /*
     * OPEN / CLOSE
     */

    $(".city-select-button").on(
        "click",
        function (e) {

            e.preventDefault();

            e.stopPropagation();


            const select =
                $(this)
                    .closest(
                        ".custom-city-select"
                    );


            /*
             * Digər açıq dropdown-ları bağlayırıq.
             */

            $(".custom-city-select")
                .not(select)
                .removeClass("active");


            /*
             * Cari dropdown.
             */

            select.toggleClass("active");

        }
    );



    /*
     * SELECT CITY
     */

    $(document).on(
        "click",
        ".city-option",
        function (e) {

            e.stopPropagation();


            const option =
                $(this);


            const value =
                option.attr("data-value");


            const text =
                option.text().trim();


            const select =
                option.closest(
                    ".custom-city-select"
                );


            /*
             * Görünən şəhər adını dəyişirik.
             */

            select
                .find(
                    ".city-selected-text"
                )
                .text(text)
                .removeClass(
                    "placeholder"
                );


            /*
             * Hidden input-a
             * şəhər dəyərini yazırıq.
             */

            $("#city")
                .val(value)
                .trigger("change");


            /*
             * Əvvəlki selected-i silirik.
             */

            select
                .find(".city-option")
                .removeClass(
                    "selected"
                );


            /*
             * Cari şəhəri selected edirik.
             */

            option.addClass(
                "selected"
            );


            /*
             * Dropdown bağlanır.
             */

            select.removeClass(
                "active"
            );


            /*
             * Validation error silinir.
             */

            const group =
                select.closest(
                    ".form-group"
                );


            group.removeClass(
                "has-error"
            );


            group.find(".form-error")
                .text("");

        }
    );



    /*
     * CLICK OUTSIDE
     */

    $(document).on(
        "click",
        function () {

            $(".custom-city-select")
                .removeClass("active");

        }
    );



    /*
     * ESC
     */

    $(document).on(
        "keydown",
        function (e) {

            if (e.key === "Escape") {

                $(".custom-city-select")
                    .removeClass("active");

            }

        }
    );



    /* =====================================================
       FORM SUBMIT
    ====================================================== */

    $("#createAdForm").on(
        "submit",
        function (e) {

            e.preventDefault();


            let isValid = true;


            /* ---------------------------------------------
               CLEAR PREVIOUS ERRORS
            --------------------------------------------- */

            $(".form-group")
                .removeClass(
                    "has-error"
                );


            $(".form-error")
                .text("");



            /* =================================================
               DÜKANIN ADI
            ================================================== */

            const shopName =
                $("#shopName")
                    .val()
                    .trim();


            if (shopName === "") {

                showError(
                    "#shopName",
                    "Dükanın adını daxil edin"
                );


                isValid = false;

            }



            /* =================================================
               MƏHSULUN ADI
            ================================================== */

            const productName =
                $("#productName")
                    .val()
                    .trim();


            if (productName === "") {

                showError(
                    "#productName",
                    "Məhsulun adını daxil edin"
                );


                isValid = false;

            }



            /* =================================================
               ƏTRAFLI MƏLUMAT
            ================================================== */

            const productFullInfo =
                $("#productFullInfo")
                    .val()
                    .trim();


            if (productFullInfo === "") {

                showError(
                    "#productFullInfo",
                    "Məhsul haqqında məlumat daxil edin"
                );


                isValid = false;

            }



            /* =================================================
               MİQDAR
            ================================================== */

            const quantity =
                $("#quantity")
                    .val()
                    .trim();


            if (
                quantity === "" ||
                Number(quantity) <= 0
            ) {

                showError(
                    "#quantity",
                    "Miqdarı düzgün daxil edin"
                );


                isValid = false;

            }



            /* =================================================
               ƏLAQƏ NÖMRƏSİ
            ================================================== */

            const phone =
                $("#phone")
                    .val()
                    .trim();


            const phoneDigits =
                phone.replace(
                    /\D/g,
                    ""
                );


            if (phone === "") {

                showError(
                    "#phone",
                    "Əlaqə nömrəsini daxil edin"
                );


                isValid = false;

            } else if (
                phoneDigits.length !== 10
            ) {

                showError(
                    "#phone",
                    "Əlaqə nömrəsini düzgün daxil edin"
                );


                isValid = false;

            }



            /* =================================================
               ŞƏHƏR
            ================================================== */

            const city =
                $("#city")
                    .val()
                    .trim();


            if (city === "") {

                showError(
                    "#city",
                    "Şəhər seçin"
                );


                isValid = false;

            }



            /* =================================================
               ÜNVAN
            ================================================== */

            const address =
                $("#address")
                    .val()
                    .trim();


            if (address === "") {

                showError(
                    "#address",
                    "Ünvanı daxil edin"
                );


                isValid = false;

            }



            /* =================================================
               ŞƏKİL
            ================================================== */

            if (
                selectedFiles.length === 0
            ) {

                const imageGroup =
                    $("#productImages")
                        .closest(
                            ".form-group"
                        );


                imageGroup.addClass(
                    "has-error"
                );


                imageGroup
                    .find(".form-error")
                    .text(
                        "Ən azı bir şəkil seçin"
                    );


                isValid = false;

            }



            /* =================================================
               IF FORM IS INVALID
            ================================================== */

            if (!isValid) {

                const firstError =
                    $(".form-group.has-error")
                        .first();


                if (
                    firstError.length
                ) {

                    $("html, body")
                        .animate(
                            {
                                scrollTop:
                                    firstError
                                        .offset()
                                        .top - 25
                            },
                            350
                        );

                }


                return;

            }



            /* =================================================
               FORM DATA
            ================================================== */

            const formData =
                new FormData(this);


            /*
             * Şəkilləri ayrıca əlavə edirik.
             */

            formData.delete(
                "productImages"
            );


            selectedFiles.forEach(
                function (file) {

                    formData.append(
                        "productImages",
                        file
                    );

                }
            );



            /* =================================================
               DEBUG
            ================================================== */

            console.log(
                "Dükan:",
                shopName
            );


            console.log(
                "Məhsul:",
                productName
            );


            console.log(
                "Ətraflı:",
                productFullInfo
            );


            console.log(
                "Miqdar:",
                quantity
            );


            console.log(
                "Telefon:",
                phone
            );


            console.log(
                "Şəhər:",
                city
            );


            console.log(
                "Ünvan:",
                address
            );


            console.log(
                "Şəkillər:",
                selectedFiles
            );



            /* =================================================
               BACKEND
            ================================================== */

            /*
            $.ajax({

                url: "/api/ads",

                type: "POST",

                data: formData,

                processData: false,

                contentType: false,

                success: function (response) {

                    console.log(
                        "Elan uğurla əlavə edildi"
                    );

                },

                error: function (xhr) {

                    console.log(
                        "Xəta baş verdi"
                    );

                }

            });
            */


            console.log(
                "Form backend-ə göndərilməyə hazırdır."
            );

        }
    );



    /* =====================================================
       SHOW ERROR
    ====================================================== */

    function showError(
        selector,
        message
    ) {

        const input =
            $(selector);


        const group =
            input.closest(
                ".form-group"
            );


        group.addClass(
            "has-error"
        );


        group
            .find(".form-error")
            .text(message);

    }



    /* =====================================================
       REMOVE ERROR WHILE TYPING
    ====================================================== */

    $("#createAdForm").on(
        "input change",
        "input, textarea",
        function () {

            const group =
                $(this)
                    .closest(
                        ".form-group"
                    );


            group.removeClass(
                "has-error"
            );


            group
                .find(".form-error")
                .text("");

        }
    );



    /* =====================================================
       IMAGE ERROR
    ====================================================== */

    $("#productImages").on(
        "change",
        function () {

            if (
                selectedFiles.length > 0
            ) {

                const group =
                    $(this)
                        .closest(
                            ".form-group"
                        );


                group.removeClass(
                    "has-error"
                );


                group
                    .find(".form-error")
                    .text("");

            }

        }
    );


});
