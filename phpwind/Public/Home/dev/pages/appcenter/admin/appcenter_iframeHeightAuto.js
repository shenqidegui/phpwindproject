/*!
 * PHPWind PAGE JS
 * @Copyright Copyright 2011, phpwind.com
 * @Descript: ��̨-Ӧ������iframe�߶���Ӧ
 * @Author	: linhao87@gmail.com
 * @Depend	: jquery.js(1.7 or later)
 * $Id$
 */
 
 ;(function(){
	//Ӧ������iframe
	var appcenter_iframe = $('#J_appcenter_iframe');
	
	setInterval(function(){
		iframeResize();
	}, 300);
	
	function iframeResize(){
		var top_iframe = $(top.document).find('#iframe_platform_'+ appcenter_iframe.data('id'));		//��̨��һ��iframe data-id��Ӧ�˵�����
		
		top_iframe.attr('scrolling', 'no');																							//ȡ������
		appcenter_iframe[0].height = $(top_iframe[0].contentWindow).height();									//д��߶�
	}
 })();