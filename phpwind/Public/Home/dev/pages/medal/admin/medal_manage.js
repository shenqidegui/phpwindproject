/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ��̨-ѫ�¹���
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery.js(1.7 or later), MEDAL_JSON����ҳ�涨��
 * $Id: medal_manage.js 4949 2012-02-28 03:16:33Z hao.lin $
 */
 
 ;(function(){
	//�䷢�����л�
	var awardtype_warp = $('#J_awardtype_warp'), //����
		awardtype_list = $('#J_awardtype_list'); //�б�
		
	$('#J_awardtype_select').on('change', function(){
		var $this = $(this);
		
		try {
			var medal_arr = [];
			$.each(MEDAL_AWARD_JSON[$this.val()], function(i, o){
				medal_arr.push('<dl><dt>'+ o.order +'</dt><dd class="num">'+ o.amount +'</dd><dd class="title">'+ o.name +'</dd></dl>')
			});
			awardtype_warp.show();
			awardtype_list.html(medal_arr.join(''));
		} catch(err) {
			awardtype_warp.hide();
			awardtype_list.empty();
		}
	});

	
 })();