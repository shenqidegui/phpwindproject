/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ǰ̨-ע���ֻ���֤
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery.js(1.7 or later), M_CHECK, M_CHECK_MOBILE ҳ�涨��
 * $Id$
 */
;
(function () {
    //�ֻ���֤
    var reg_mobile = $('#J_reg_mobile'), //�ֻ�����input
		pwd_username = $('#J_pwd_username'), //�û���
        show_mcode = $('#J_show_mcode'), //��ȡ�ֻ���֤�밴ť
        mcode_resend = $('#J_mcode_resend'), //���·��Ͱ�ť
        send_mobile = $('#J_send_mobile'), //��д���ֻ�����
        mcode_tip = $('#J_mcode_tip'), //�ֻ���֤��������ʾ
        reg_tip__mobile = $('#J_reg_tip__mobile'), //�ֻ��Ŵ�����ʾ
        reg_mobileCode = $('#J_reg_mobileCode'), //�ֻ���֤��input
        counttime = parseInt(reg_mobile.data('counttime')), //����ʱ�� ��
        count_timer;

    var mCheckUtil = {
        check : function(elem, callback){
        	//��֤�ֻ�������֤��
        	Wind.Util.ajaxBtnDisable(elem);
            $.post(M_CHECK, {
				mobile : reg_mobile.val(),
				username : pwd_username.val()
			}, function(data){
            	Wind.Util.ajaxBtnEnable(elem);
                if(data.state == 'success') {
                    if(callback) {
                        callback();
                    }
                }else if(data.state == 'fail'){
                    Wind.Util.resultTip({
                        error : true,
                        follow : elem,
                        msg : data.message
                    });
                    reg_mobile.prop('disabled', false).removeClass('disabled');
                }
            }, 'json');
        },
        countDown : function(){
        	//����ʱ
        	var _this = this,
        		c = counttime;

        	mcode_resend.text(c+'������·���').prop('disabled', true).addClass('disabled');

        	count_timer = setInterval(function(){
        		c--;
        		mcode_resend.text(c+'������·���');
        		if(c <= 0) {
        			clearInterval(count_timer);
        			mcode_resend.text('���·���').prop('disabled', false).removeClass('disabled');
        			return;
        		}
        	}, 1000);
        }
    };

    reg_mobile.val('');
    reg_mobile.prop('disabled', false);

    var m_timer,
    	regexp = /^(13[0-9]|15[0-9]|18[0-9])\d{8}$/,
        checkin = false,
        _v;

    reg_mobile.on('focus', function(){
    	//�ֻ�����۽�
        var $this = $(this);
        reg_tip__mobile.hide();
        //��ʱ����ʼ
        m_timer = setInterval(function(){
            var trim_v = $.trim($this.val());

            if(trim_v.length == 11 && regexp.test(trim_v)) {
                //�ֻ���ʽ��֤ͨ��

                if(checkin || trim_v == _v) {
                    //�������֤���ѯֵ�ظ�
                    return;
                }
                checkin = true

                $.post(M_CHECK_MOBILE,{
                    mobile : trim_v,
					username : pwd_username.val()
                }, function(data){
                    _v = trim_v;
                    checkin = false;
                    if(data.state == 'success') {
                        show_mcode.show();
                        $('#J_reg_mobile_hide').val(trim_v);
                        reg_tip__mobile.hide().empty();
                    }else if(data.state == 'fail') {
                        reg_tip__mobile.html('<span class="tips_icon_error">'+ data.message +'</span>').show();
                    }
                }, 'json');
                /**/
            }else{
                show_mcode.hide();
                reg_tip__mobile.hide();
            }
        }, 200);

    }).on('blur', function(){
        //����ʧ���������ʱ
        clearInterval(m_timer);

        var trim_v = $.trim($(this).val());
        reg_tip__mobile.show();

        if(!trim_v) {
        	reg_tip__mobile.html('<span class="tips_icon_error">�ֻ����벻��Ϊ��</span>');
        	return;
        }

        if(trim_v.length !== 11 || !regexp.test(trim_v)) {
            //�ֻ��Ŵ�����ʾ
            reg_tip__mobile.html('<span class="tips_icon_error">����ȷ��д�����ֻ�����</span>');
            return;
        }
        
    });

    //��ȡ��֤��
    show_mcode.on('click', function(e){
        e.preventDefault();
        reg_mobile.prop('disabled', true).addClass('disabled');

        mCheckUtil.check(show_mcode, function(){
            show_mcode.hide();
            mcode_tip.show();
            $('#J_reg_tip_mobile').empty();
            reg_mobileCode.focus();
            send_mobile.text(reg_mobile.val());
            mCheckUtil.countDown();
        });
    });

    //�޸ĺ���
    $('#J_mobile_change').on('click', function(e){
    	e.preventDefault();
    	reg_mobile.prop('disabled', false).removeClass('disabled').val('').focus();
        mcode_tip.hide();
        clearInterval(count_timer);

		//���öԱ�ֵ
		_v = undefined;
    });

    //���·���
    mcode_resend.on('click', function(e){
    	e.preventDefault();

    	if(!mcode_resend.hasClass('disabled')) {
    		mCheckUtil.check(mcode_resend, function(){
    			reg_mobileCode.focus();
	            mCheckUtil.countDown();
	        });
    	}
    });

})();