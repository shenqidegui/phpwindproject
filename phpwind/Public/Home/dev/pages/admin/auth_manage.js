/*!
 * PHPWind PAGE JS
 * ��̨-���/�༭�û�
 * Author: linhao87@gmail.com
 */
    Wind.use('dialog', 'ajaxForm', function () {

        //��ӽ�ɫ
        $('#J_auth_role_add').click(function(e){
            e.preventDefault();
            var sel_val = $('#J_roles').val(),
            has_role = $('#J_user_roles > option[value = "' + sel_val + '"]');
            if (sel_val && !has_role.length) {
                $('#J_roles option:selected').clone().appendTo($('#J_user_roles'));
            }
        });
        
        //�Ƴ���ɫ
        $('#J_auth_role_del').click(function(e){
            e.preventDefault();
            var user_sel_val = $('#J_user_roles').val();
            if (user_sel_val) {
                $('#J_user_roles > option[value = "' + user_sel_val + '"]').remove();
            }
        });
        
        //�ύ
	var auth_sub = $('#J_auth_sub'),
        submit_tips = $('#J_submit_tips');

  auth_sub.click(function(e){
            //ȫѡӵ�н�ɫ��select
			$('#J_user_roles > option').prop('selected', true);
			
			$('#J_auth_form').ajaxForm({
				dataType	: 'json',
        beforeSubmit : function(){
          //��ť�İ���״̬�޸�
          var textnode = document.createTextNode('��...');
          auth_sub[0].appendChild(textnode);
          auth_sub.prop('disabled',true).addClass('disabled');
        },
				success     : function(data){
          var org_text = auth_sub.text();
       		auth_sub.text(org_text.replace(/(��...)$/, '')).parent().find('span').remove();

					if (data.state === 'success') {
						$('<span class="tips_success">' + data.message + '</span>' ).appendTo(auth_sub.parent()).fadeIn('slow').delay( 1000 ).fadeOut(function() {
							reloadPage(window.parent);
						});
					}else if(data.state === 'fail'){
						$('<span class="tips_error">' + data.message + '</span>' ).appendTo(auth_sub.parent()).fadeIn( 'fast' );
						auth_sub.removeProp('disabled').removeClass('disabled');
          }
				}
			});
        });
		
});