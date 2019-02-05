$(function () {
    try {
        window.prettyPrint && prettyPrint();

        $('#download-bootprompt').on('click', function(e){
            e.preventDefault();

            bootprompt.alert({
                title: 'Bootprompt.js',
                message: '<h3><i class="fa fa-smile-o"></i> Hey there!</h3> <p>Thank you for your interest. Unfortunately, Bootprompt 5 is not ready for distribution yet. '
                    + 'If you want to start testing it, grab <a href="https://github.com/tiesont/bootprompt">the source code</a> and '
                    + 'report any issues you find.</p>'
            });
        });

        if(anchors){
            anchors.options.placement = 'left';
            anchors.add('.bb-anchor');
        }
    }
    catch (ex) {
        console.log(ex.message);
    }
});
