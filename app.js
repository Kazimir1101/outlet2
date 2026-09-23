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
       QUANTITY — MAX 3 RƏQƏM
    ====================================================== */

    $("#quantity").on("input", function () {

        let value =
            $(this)
                .val()
                .replace(/\D/g, "")
                .substring(0, 3);

        /*
         * Əgər istifadəçi 0 ilə başlayırsa,
         * onu təmizləyirik (məsələn "0" və ya "01").
         */

        if (value.length > 0 && value.charAt(0) === "0") {

            value = value.replace(/^0+/, "");

        }

        $(this).val(value);

    });



    /*
     * Klaviatura ilə qadağan olunmuş simvolları bloklayırıq:
     * e, E, +, -, ., ,
     */

    $("#quantity").on("keydown", function (e) {

        const forbiddenKeys = [
            "e",
            "E",
            "+",
            "-",
            ".",
            ","
        ];

        if (forbiddenKeys.indexOf(e.key) !== -1) {

            e.preventDefault();

        }

    });



    /*
     * Paste zamanı da yalnız rəqəmləri və maksimum 3 simvolu saxlayırıq.
     */

    $("#quantity").on("paste", function (e) {

        e.preventDefault();

        const pasted =
            (e.originalEvent || e)
                .clipboardData
                .getData("text");

        let value =
            pasted
                .replace(/\D/g, "")
                .substring(0, 3);

        if (value.length > 0 && value.charAt(0) === "0") {

            value = value.replace(/^0+/, "");

        }

        $(this).val(value);

    });


        /* =====================================================
       PRICE INPUTS — YALNIZ RƏQƏM + NÖQTƏ
       MAX 5 RƏQƏM (TAM HİSSƏ)
    ====================================================== */

    function formatPriceInput($input) {

        let value =
            $input.val();

        /*
         * Yalnız rəqəm və nöqtəyə icazə veririk.
         * Vergülü avtomatik nöqtəyə çeviririk.
         */

        value =
            value
                .replace(/,/g, ".")
                .replace(/[^0-9.]/g, "");


        /*
         * Yalnız bir nöqtə olsun.
         */

        const firstDot =
            value.indexOf(".");

        if (firstDot !== -1) {

            value =
                value.substring(0, firstDot + 1) +
                value
                    .substring(firstDot + 1)
                    .replace(/\./g, "");

        }


        /*
         * Tam hissə maksimum 5 rəqəm.
         */

        let parts =
            value.split(".");

        parts[0] =
            parts[0]
                .replace(/^0+(?=\d)/, "")
                .substring(0, 5);


        /*
         * Onluq hissə maksimum 2 rəqəm.
         */

        if (parts.length > 1) {

            parts[1] =
                parts[1]
                    .substring(0, 2);

        }


        /*
         * Yenidən yığırıq.
         */

        value = parts.join(".");


        $input.val(value);

    }



    /*
     * Input — istifadəçi yazarkən
     */

    $("#oldPrice, #newPrice").on(
        "input",
        function () {

            formatPriceInput($(this));

        }
    );



    /*
     * Keydown — qadağan olunmuş simvolları bloklayırıq
     * (e, E, +, -, boşluq)
     */

    $("#oldPrice, #newPrice").on(
        "keydown",
        function (e) {

            const forbiddenKeys = [
                "e",
                "E",
                "+",
                "-",
                " "
            ];

            if (
                forbiddenKeys.indexOf(e.key) !== -1
            ) {

                e.preventDefault();

            }

        }
    );



    /*
     * Paste — yalnız rəqəm və nöqtə
     */

    $("#oldPrice, #newPrice").on(
        "paste",
        function (e) {

            e.preventDefault();

            const pasted =
                (e.originalEvent || e)
                    .clipboardData
                    .getData("text");

            $(this).val(pasted);

            formatPriceInput($(this));

        }
    );


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
     * OPEN / CLOSE CITY
     */

    $(document).on(
        "click",
        ".city-select-button",
        function (e) {

            e.preventDefault();

            e.stopPropagation();


            const select =
                $(this)
                    .closest(
                        ".custom-city-select"
                    );


            /*
             * Duration dropdown-u bağlayırıq.
             */

            $(".custom-duration-select")
                .removeClass("active");


            /*
             * Digər city dropdown-ları bağlayırıq.
             */

            $(".custom-city-select")
                .not(select)
                .removeClass("active");


            /*
             * Cari dropdown-u açırıq / bağlayırıq.
             */

            select.toggleClass("active");

        }
    );



    /* =====================================================
       SELECT CITY
    ====================================================== */

    $(document).on(
        "click",
        ".city-option",
        function (e) {

            e.preventDefault();

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
             * Hidden input-a şəhər dəyərini yazırıq.
             */

            $("#city")
                .val(value);


            /*
             * Dropdown bağlanır.
             */

            select.removeClass(
                "active"
            );


            /*
             * Validation error silinir.
             */

            clearFieldError("#city");

        }
    );



    /* =====================================================
       CUSTOM ELAN MÜDDƏTİ SELECT
    ====================================================== */


    /*
     * OPEN / CLOSE DURATION
     */

    $(document).on(
        "click",
        ".duration-select-button",
        function (e) {

            e.preventDefault();

            e.stopPropagation();


            const select =
                $(this)
                    .closest(
                        ".custom-duration-select"
                    );


            if (!select.length) {

                return;

            }


            /*
             * City dropdown-u bağlayırıq.
             */

            $(".custom-city-select")
                .removeClass("active");


            /*
             * Digər duration dropdown-ları bağlayırıq.
             */

            $(".custom-duration-select")
                .not(select)
                .removeClass("active");


            /*
             * Cari dropdown-u açırıq / bağlayırıq.
             */

            select.toggleClass("active");

        }
    );



    /* =====================================================
       SELECT DURATION
    ====================================================== */

    $(document).on(
        "click",
        ".duration-option",
        function (e) {

            e.preventDefault();

            e.stopPropagation();


            const option =
                $(this);


            const value =
                option.attr("data-value");


            const text =
                option.text().trim();


            const select =
                option.closest(
                    ".custom-duration-select"
                );


            if (!select.length) {

                return;

            }


            /*
             * Görünən müddəti dəyişirik.
             */

            select
                .find(
                    ".duration-selected-text"
                )
                .text(text)
                .removeClass(
                    "placeholder"
                );


            /*
             * Əvvəlki selected-ləri silirik.
             */

            select
                .find(".duration-option")
                .removeClass(
                    "selected"
                );


            /*
             * Cari variantı selected edirik.
             */

            option.addClass(
                "selected"
            );


            /*
             * Hidden input-a dəyəri yazırıq.
             */

            $("#deleteAfter")
                .val(value);


            /*
             * Validation error silinir.
             */

            clearFieldError("#deleteAfter");


            /*
             * Dropdown bağlanır.
             */

            select.removeClass(
                "active"
            );

        }
    );



    /* =====================================================
       CLICK OUTSIDE
    ====================================================== */

    $(document).on(
        "click",
        function (e) {

            if (
                $(e.target).closest(
                    ".custom-city-select, .custom-duration-select"
                ).length
            ) {

                return;

            }


            $(".custom-city-select")
                .removeClass("active");


            $(".custom-duration-select")
                .removeClass("active");

        }
    );



    /* =====================================================
       ESC
    ====================================================== */

    $(document).on(
        "keydown",
        function (e) {

            if (e.key === "Escape") {

                $(".custom-city-select")
                    .removeClass("active");


                $(".custom-duration-select")
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
                Number(quantity) <= 0 ||
                Number(quantity) > 999 ||
                !/^\d{1,3}$/.test(quantity)
            ) {

                showError(
                    "#quantity",
                    "Miqdarı düzgün daxil edin"
                );


                isValid = false;

            }



            /* =================================================
               QİYMƏT
            ================================================== */

            const oldPrice =
                $("#oldPrice")
                    .val()
                    .trim();


            const newPrice =
                $("#newPrice")
                    .val()
                    .trim();



            if (
                oldPrice === "" ||
                Number(oldPrice) <= 0
            ) {

                showError(
                    "#oldPrice",
                    "Köhnə qiyməti daxil edin"
                );


                isValid = false;

            }



            if (
                newPrice === "" ||
                Number(newPrice) <= 0
            ) {

                showError(
                    "#newPrice",
                    "Yeni qiyməti daxil edin"
                );


                isValid = false;

            }



            if (
                oldPrice !== "" &&
                newPrice !== "" &&
                Number(oldPrice) > 0 &&
                Number(newPrice) > 0 &&
                Number(newPrice) >= Number(oldPrice)
            ) {

                showError(
                    "#newPrice",
                    "Yeni qiymət köhnə qiymətdən aşağı olmalıdır"
                );


                isValid = false;

            }



            /* =================================================
               ELAN MÜDDƏTİ
            ================================================== */

            const deleteAfter =
                $("#deleteAfter")
                    .val()
                    .trim();


            if (deleteAfter === "") {

                showError(
                    "#deleteAfter",
                    "Elan müddətini seçin"
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

            console.log("Dükan:", shopName);
            console.log("Məhsul:", productName);
            console.log("Ətraflı:", productFullInfo);
            console.log("Miqdar:", quantity);
            console.log("Əvvəlki qiymət:", oldPrice);
            console.log("Endirimli qiymət:", newPrice);
            console.log("Elan müddəti:", deleteAfter);
            console.log("Telefon:", phone);
            console.log("Şəhər:", city);
            console.log("Ünvan:", address);
            console.log("Şəkillər:", selectedFiles);



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


        if (!input.length) {

            return;

        }


        let group =
            input.closest(
                ".form-group"
            );


        if (
            !group.length &&
            selector === "#deleteAfter"
        ) {

            group =
                input.closest(
                    ".price-duration-group"
                );

        }


        if (!group.length) {

            group =
                input.parent();

        }


        group.addClass(
            "has-error"
        );


        group
            .find(".form-error")
            .first()
            .text(message);

    }



    /* =====================================================
       CLEAR FIELD ERROR
    ====================================================== */

    function clearFieldError(
        selector
    ) {

        const input =
            $(selector);


        if (!input.length) {

            return;

        }


        let group =
            input.closest(
                ".form-group"
            );


        if (
            !group.length &&
            selector === "#deleteAfter"
        ) {

            group =
                input.closest(
                    ".price-duration-group"
                );

        }


        if (!group.length) {

            group =
                input.parent();

        }


        group.removeClass(
            "has-error"
        );


        group
            .find(".form-error")
            .first()
            .text("");

    }



    /* =====================================================
       REMOVE ERROR WHILE TYPING
    ====================================================== */

    $("#createAdForm").on(
        "input change",
        "input, textarea",
        function () {

            const element =
                $(this);


            let group =
                element.closest(
                    ".form-group"
                );


            if (
                !group.length &&
                element.is("#deleteAfter")
            ) {

                group =
                    element.closest(
                        ".price-duration-group"
                    );

            }


            if (!group.length) {

                return;

            }


            group.removeClass(
                "has-error"
            );


            group
                .find(".form-error")
                .first()
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



    /* =====================================================
       BACK TO MAIN
    ====================================================== */

    $(".back-to-main-button").on(
        "click",
        function (e) {

            e.preventDefault();


            window.location.href =
                "/home/index.html";

        }
    );


});
