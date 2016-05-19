/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-����-ͷ����ͨ�ϴ�
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery.js(1.7 or later), global.js, TAG_DEL
 * $Id$
 */
 
Wind.use('ajaxForm', function(){
	var avatgar_normal_btn = $('#J_avatgar_normal_btn'),
		error_map = {
			'-90' : '����ʱ',
			'-91' : '�������',
			'-92' : '�������',
			'-93' : '����������',
			'-80' : '�ϴ�ʧ��',
			'-81' : '�ϴ����ʹ���',
			'-82' : '�ļ���С����',
			'-83' : '�ļ���С��������',
			'-84' : '�ļ�����'
		};

	var form = $('#J_avatgar_normal_form'),
		action = form.attr('action');

	var url_re = /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/;
	var domain = url_re.exec( action ) || [];
	if(domain[6] !== location.host) {
		//��ͬ��
		$.ajaxSetup({
			beforeSend: $.noop,
			complete: function(jqXHR){
				Wind.Util.ajaxBtnEnable(avatgar_normal_btn);
				if(jqXHR.statusText == 'error') {
					Wind.Util.formBtnTips({
						wrap : avatgar_normal_btn.parent(),
						msg : '�ϴ��ɹ�'
					});
				}
				
			}
		});
	}

	form.ajaxForm({
		beforeSubmit : function(){
			Wind.Util.ajaxBtnDisable(avatgar_normal_btn);
		},
		success : function(data){
			Wind.Util.ajaxBtnEnable(avatgar_normal_btn);
			if(data == '1') {
				Wind.Util.formBtnTips({
					wrap : avatgar_normal_btn.parent(),
					msg : '�ϴ��ɹ�'
				});
			}else{
				var msg;
				data = String(data);
				if(error_map[data]) {
					msg = error_map[data];
				}else{
					msg = '�ϴ�����'
				}
				
				Wind.Util.formBtnTips({
					error : true,
					wrap : avatgar_normal_btn.parent(),
					msg : msg
				});

			}
		}
	});

});