$(function () {
    try {
        window.prettyPrint && prettyPrint();

        $('#download-bootshine').on('click', function(e){
            e.preventDefault();

            bootshine.alert({
                title: 'Bootshine.js',
                message: '<h3><i class="fa fa-smile-o"></i> Hey there!</h3> <p>Thank you for your interest. Unfortunately, Bootshine 5 is not ready for distribution yet. '
                    + 'If you want to start testing it, grab <a href="https://github.com/tiesont/bootshine">the source code</a> and '
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
