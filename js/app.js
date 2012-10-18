window.app = (  function( window, $, snack ){
	'use strict';

	var parseData = function( data ) {

		var json     = snack.parseJSON( data ),
			key      = null,
			ele      = null,
			val      = null,
			sections = $('[data-content]'),
			section  = null;

		document.title =  'Resumé for ' + json.name;

		$( '#contact' )[0].innerHTML = json.contact;

		for( key in json ){

			val = json[ key ];
			ele = $( '[data-content=' + key + ']' )[ 0 ];

			if( ele ){
				//standard keys just populate the section
				if( !snack.isArray( val ) ){

					ele.innerHTML = val;
				}
				else if( snack.isArray( val ) ){
					var frag = '';

					snack.each( val , function( item, index ){
						var template = $( '#' + key + '-template' )[ 0 ];

						//template found, key is a string
						if( template && typeof item === 'string' ){

							frag = frag + template.innerHTML.replace('${' + key + '}', item );
						}
						else if( template && typeof item === 'object' ){

							var cur = template.innerHTML;

							for( var innerKey in item ){
								cur = cur.replace('${' + innerKey + '}', item[ innerKey ] );
							}

							frag = frag + cur;
						}
					});

					ele.innerHTML = frag;
				}
			}
		}

		for( var i = 0; i < sections.length; i++ ){
			section = sections[ i ];

			if( !section.innerHTML.match( /\w/ ) ){

				section.parentNode.style.display = 'none';
			}
		}
	};

	return {
		loadData : function( ) {
			var opts = {
				method : 'get',
				url : 'resume.json'
			};

			snack.request( opts, function( err, response ) {
				if( err ){
					return;
				}
				else{
					parseData( response );
				}
			} );
		}
	};

}( window, window.Sizzle, window.snack ) );