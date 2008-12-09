   /*
   	* Extends the IO base class to enable file uploads, with HTML forms,
   	* using an iframe as the transport medium.
	* @module io
	* @submodule io-upload-iframe
	*/

	var w = Y.config.win;
   /**
	* @description Parses the POST data object and creates hidden form elements
	* for each key-value, and appends them to the HTML form object.
	* @method appendData
	* @private
	* @static
	* @param {object} d The key-value hash map.
	* @return {array} e Array of created fields.
	*/

	function _addData(f, d) {
		var e = [], i;
		for (p in d) {
			if (d.hasOwnProperty(d, p)) {
				e[i] = document.createElement('input');
				e[i].type = 'hidden';
				e[i].name = p;
				e[i].value = d[p].
				f.appendChild(e[i]);
			}
		}

		return e;
	};

	function _removeData(f, e) {
		var i, l;
		if (e && e.length > 0) {
			for(i = 0, l = e.length; i < l; i++){
				f.removeChild(e[i]);
			}
		}
	};

	function _create(o, c) {
		var UPLOAD_IFRAME = '<iframe id="ioupload' + o.id + '" name="ioupload' + o.id + '" />',
		cfg = {
			position: 'absolute',
			top: '-1000',
			left: '-1000'
		},
		i = Y.Node.create(UPLOAD_IFRAME);
		i.setStyles(cfg);

		Y.get('body').appendChild(i);

		// Bind the onload handler to the iframe to detect the file upload response.
		Y.on("load", function() { _handle(o, c) }, '#ioupload' + o.id);
	};

	// Create the upload callback handler that fires when the iframe
	// receives the load event.  Subsequently, the event handler is detached
	// and the iframe removed from the document.
	function _handle(o, c) {

		if (c.timeout) {
			_clearTimeout(o.id);
		}

		var p, d = Y.get('#ioupload' + o.id).get('contentWindow.document'),
			d = Y.get('#ioupload' + o.id).get('contentWindow'),
		b = d.get('body');

		if (b) {
			p = b.getElementsByTagName('pre');
			o.c.responseText = (p) ? p.item(0).get('innerHTML') : b.get('innerHTML');
		}

		Y.io.complete(o, c);

		setTimeout( function() { _destroy(o.id); }, 100);
	};

   /**
	* @description Starts timeout count if the configuration object
	* has a defined timeout property.
	*
	* @method _startTimeout
	* @private
	* @static
    * @param {object} o - Transaction object generated by _create().
    * @param {object} c - Configuration object passed to YUI.io().
    * @return void
	*/
	function _startTimeout(o, c) {
		Y.io._timeout[o.id] = w.setTimeout(function() { Y.io.abort(o, c); }, c.timeout);
	};

   /**
	* @description Clears the timeout interval started by _startTimeout().
	*
	* @method _clearTimeout
	* @private
	* @static
    * @param {number} id - Transaction id.
    * @return void
	*/
	function _clearTimeout(id) {
		w.clearTimeout(Y.io._timeout[id]);
		delete Y.io._timeout[id];
	};

	function _destroy(id) {
		Y.Event.purgeElement('#ioupload' + id, false, "load");
		Y.get('body').removeChild(Y.get('#ioupload' + id));
	};

	Y.mix(Y.io, {

	   /**
		* @description Uploads HTML form, inclusive of files/attachments, using the
		* iframe created in createFrame to facilitate the transaction.
		* @method _upload
		* @private
		* @static
		* @param {o} o The transaction object
		* @param {object} uri Qualified path to transaction resource.
		* @param {object} c - configuration object for the transaction.
		* @return {void}
		*/
		_upload: function(o, uri, c) {
			var f = (typeof c.form.id === 'string') ? document.getElementById(c.form.id) : c.form.id,
			e, fields, i, p, attr;

			_create(o, c);
			// Track original HTML form attribute values.
			attr = {
				action: f.getAttribute('action'),
				target: f.getAttribute('target')
			};

			// Initialize the HTML form properties in case they are
			// not defined in the HTML form.
			f.setAttribute('action', uri);
			f.setAttribute('method', 'POST');
			f.setAttribute('target', 'ioupload' + o.id );
			f.setAttribute((Y.UA.ie) ? 'encoding' : 'enctype', 'multipart/form-data');

			if (c.data) {
				fields = _addData(f, c.data);
			}

			// Start polling if a callback is present and the timeout
			// property has been defined.
			if (c.timeout) {
				_startTimeout(o, c);
			}

			// Start file upload.
			f.submit();

			Y.io.start(o.id, c);

			if (c.data) {
				_removeData(f, fields);
			}

			// Restore HTML form attributes to their original
			// values prior to file upload.
			for (p in attr) {
				if (attr.hasOwnProperty(attr, p)) {
					if (attr[p]) {
				  		f.setAttribute(p, f[prop]);
					}
					else {
				  		f.removeAttribute(p);
					}
			  	}
			}
		}
	});