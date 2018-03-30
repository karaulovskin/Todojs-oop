export default class FormSend {
    constructor() {
        let self = this;

        $('[data-form]:not([data-form-no-ajax])').on('form::valid', function(e) {
            var form = $(this);
            var formData = new FormData(form[0]);

            self.send(form, formData);
        });
    }

    send(form, formData) {
        if (!form.attr('data-ajax-no-loader'))
            // App.Loader.showLoader();

        $.ajax({
            type: "POST",
            data: formData,
            url: form.attr('data-ajax-url') || SITE_TEMPLATE_PATH + "/ajax/form.php",
            processData: false,
            contentType: false,
            beforeSend: function () {
                // Удаляем блок с ошибками перед отправкой
                form.find('.form-row--errors').remove();
            },
            success: function (data) {
                if (!form.attr('data-ajax-no-loader')) /*App.Loader.hideLoader();*/

                var parsedData = JSON.parse(data);

                if (parsedData.errors) {
                    // Кидаем ошибки в начало формы
                    form.prepend('<div class="form-row form-row--errors"></div>');
                    var errorsBlock = form.find('.form-row--errors');

                    // Каждую ошибку добавляем в алерт
                    parsedData.errors.forEach(function (item) {
                        errorsBlock.prepend('<div class="alert alert--red">' + item + '</div>');
                    });
                } else {
                    form.trigger('form::successful', parsedData);

                    if (!form.attr('data-ajax-no-modal')) {
                        if (form.attr('data-ajax-modal')) {
                            $(form.attr('data-ajax-modal')).data('modal').open();
                        } else {
                            $('#modal-success').data('modal').open();
                        }
                    }

                    // Очищаем форму
                    if (!form.attr('data-ajax-noclean')) {
                        form[0].reset();
                        form.find('.form-block__attach').empty();
                    }
                }
            }
        });
    }
}