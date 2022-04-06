/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß, Patrik Germann
 * @copyright   2012 - 2021
 * @license     GPL [http://www.gnu.de]
 * @version     2.4.1
 * -----------------------------------------------------------------------------
 * @label       openHAB
 *
 * @default     driver_port             8080
 * @default     driver_tlsport          8443
 * @default     driver_realtime         true
 * @default     driver_autoreconnect    true
 * @default     driver_consoleport      8101
 * @default     driver_consoleusername  openhab
 * @default     driver_consolepassword  habopen
 *
 * @hide        reverseproxy
 * @hide        sv_hostname
 * @hide        proxy
 * @hide        proxy_url
 * @hide        proxy_user
 * @hide        proxy_password
 */

/**
 * Class for controlling all communication with a connected system. There are
 * simple I/O functions, and complex functions for real-time values.
 */
var io = {

	//  debug switch
	debug   : false,

	// refreshtimer in seconds
	timer   : 1,

	// servertimeout in seconds
	timeout : 5,

	// -----------------------------------------------------------------------------
	// P U B L I C   F U N C T I O N S
	// -----------------------------------------------------------------------------

	/**
	 * Does a read-request and adds the result to the buffer
	 *
	 * @param      the item
	 */
	read: function (item) {
		io.debug && console.log("io.read(item = " + item + ")");

		$.ajax({
			url     : io.url + 'items/' + item + '/state',
			headers : (io.auth !== false ? io.auth : {}),
			type    : 'GET',
			timeout : io.timeout,
			async   : true,
			cache   : false
		}).done(function(state) {
			var val = io.convertState(item, state);
			io.debug && console.log("io.read: widget.update(item = " + item + ", value = " + val + ")");
			widget.update(item, val);
			if (io.plot.listeners[item] && Date.now() - io.plot.items[io.plot.listeners[item]] > io.plot.timer) {
				io.plot.get(io.plot.listeners[item]);
			}
		}).fail(notify.json);
	},

	/**
	 * Does a write-request with a value
	 *
	 * @param      the item
	 * @param      the value
	 */
	write: function (item, val) {
		io.debug && console.log("io.write(item = " + item + ", val = " + val + ")");

		var transval = new Array();
		switch (io.itemType[item]) {
			case "Contact":
				transval[0] = "CLOSED";
				transval[1] = "OPEN";
			break;
//			case "Dimmer":
			case "Switch":
				transval[0] = "OFF";
				transval[1] = "ON";
			break;
			case "Rollershutter":
				transval[0] = "UP";
				transval[1] = "STOP";
				transval[100] = "DOWN";
			break;
		}

		var state = (val in transval) ? transval[val] : val;
		io.debug && console.debug("io.write(item = " + item + ", val = " + state + ")");
		$.ajax({
			url         : io.url + 'items/' + item,
			headers     : (io.auth !== false ? io.auth : {}),
			data        : state.toString(),
			method      : 'POST',
			contentType : 'text/plain',
			timeout     : io.timeout,
			cache       : false
		}).success(function() {
			if (!sv.config.driver.realtime || io.refreshIntervall) {
				io.debug && console.debug("io.run: widget.update(item = " + item + ", value = " + val + ")");
				widget.update(item, val);
			}
		}).fail(notify.json);
	},

	/**
	 * Trigger a logic
	 *
	 * @param      command
	 * @param      options
	 */
	trigger: function (name, val) {
		io.debug && console.log("io.trigger(name = " + name + ", val = " + val + ")");
		var cmd = name + ((val) ? ' ' + val : '');
		io.console(cmd, function(response){
			io.debug && console.debug("io.console.exec(response = " + response + ")");
		});
	},

	/**
	 * Initializion of the driver
	 *
	 * Driver config parameters are globally available as from v3.2
	 */
	init: function () {
		!io.debug && console.info("Type 'io.debug=true;' to console to see more details.");
		io.debug && console.log("io.init()");

		if (!sv.config.driver) { //kompatibiliät zu smartVISU <= 3.1
			sv.config['driver'] = {
				address : arguments[0],
				port    : arguments[1]
			};
		}

		io.debug && console.debug("io.init(address = " + sv.config.driver.address + ", port = " + sv.config.driver.port + ", ssl = " + sv.config.driver.ssl + ", username = " + sv.config.driver.username + ", password = " + sv.config.driver.password + ")");

		if (sv.config.driver.ssl == true) {
			io.url = 'https://' + sv.config.driver.address + (sv.config.driver.tlsport ? ":" + sv.config.driver.tlsport : '') + "/rest/";
		} else {
			io.url = 'http://' + sv.config.driver.address + (sv.config.driver.port ? ":" + sv.config.driver.port : '') + "/rest/";
		}
		io.debug && console.debug("url = " + io.url);

		if (sv.config.driver.username) {
			io.auth = {"Authorization": "Basic " + btoa(sv.config.driver.username + ':' + sv.config.driver.password)};
		}
		io.debug && console.debug("io.init(auth = " + io.auth + ")");

		if(io.socket != null && io.socket.readyState == 3) {
			io.run();
		}

		io.timer      *= 1000;
		io.timeout    *= 1000;
		io.plot.timer *= 1000;
		io.log.timer  *= 1000;

		$.ajax({
			url      : io.url,
			headers  : (io.auth !== false ? io.auth : {}),
			type     : 'GET',
			timeout  : io.timeout,
			async    : false,
			cache    : true
		}).fail(function(jqXHR, status, errorthrown) {
			if (status == 'error' && jqXHR.statusText.indexOf('NetworkError') === 0) {
				if (notify.message) { //kompatibiliät zu smartVISU <= 3.1
					notify.message('error', sv_lang.status_event_format.error.timeout, sv_lang.status_event_format.error.servererror);
				} else {
					notify.error('Timeout', 'Server not available. Hostname and Port correct?');
				}
			} else {
				notify.json(jqXHR, status, errorthrown);
			}
			sv.config.driver.realtime = false;
		});
	},

	/**
	 * Lets the driver work
	 */
	run: function () {
		io.debug && console.log("io.run(realtime = " + sv.config.driver.realtime + ")");

		if (widget.listeners().length) {
			var items = widget.listeners();
			for (var i = 0; i < items.length; i++) {
				$.ajax({
					url      : io.url + 'items/' + items[i],
					headers  : (io.auth !== false ? io.auth : {}),
					type     : 'GET',
					dataType : 'json',
					timeout  : io.timeout,
					async    : true,
					cache    : false
				}).done(function(ohItem) {
					var item = ohItem.name;
					io.itemType[item] = ohItem.type;
					if (!sv.config.driver.realtime) {
						var val = io.convertState(item, ohItem.state);
						io.debug && console.debug("io.run: widget.update(item = " + item + ", value = " + val + ")");
						widget.update(item, val);
					}
				}).fail(notify.json);
			}

			io.log.get();

			if (sv.config.driver.realtime) {
				if (io.auth && typeof EventSourcePolyfill == 'function') {
					io.socket = new EventSourcePolyfill(io.url + 'events/states', {heartbeatTimeout: 18000000, headers: (io.auth !== false ? io.auth : {})});
				} else if (typeof EventSource == 'function') {
					io.socket = new EventSource(io.url + 'events/states');
				}
				if (io.socket != null) {
					io.socket.addEventListener('ready', function(message) {
						$.ajax({
							url         : io.url + 'events/states/' + message.data,
							headers     : (io.auth !== false ? io.auth : {}),
							data        : JSON.stringify(items),
							method      : 'POST',
							contentType : 'application/json',
							timeout     : io.timeout,
							async       : true,
							cache       : false
						}).success(
							io.debug && console.debug('io.socket.addEventListener = ' + message.data)
						).fail(notify.json);
					});
					io.socket.onmessage = function(message) {
						var states = JSON.parse(message.data);
						Object.keys(states).forEach((item) => {
							var val = states[item].state;
							io.debug && console.debug("io.run: eventmessage(item = " + item + ", value = " + val + ")");
							val = io.convertState(item, val);
							io.debug && console.debug("io.run: widget.update(item = " + item + ", value = " + val + ")");
							widget.update(item, val);
							if (io.plot.listeners[item] && Date.now() - io.plot.items[io.plot.listeners[item]] > io.plot.timer) {
								io.plot.get(io.plot.listeners[item]);
							}
						});
					}
				} else {
					io.refreshIntervall = setInterval(function() {
						var items = widget.listeners();
						for (var i = 0; i < widget.listeners().length; i++) {
							io.read(items[i]);
						}
					}, io.timer);
				}

				io.log.refreshIntervall = setInterval(function() {
					io.log.get();
				}, io.log.timer);
			}
		}

		io.plot.init();
	},


	// -----------------------------------------------------------------------------
	// C O M M U N I C A T I O N   F U N C T I O N S
	// -----------------------------------------------------------------------------
	// The functions in this paragraph may be changed. They are all private and are
	// only be called from the public functions above. You may add or delete some
	// to fit your requirements and your connected system.

	url              : '',
	socket           : null,
	auth             : false,
	itemType         : new Array(),
	refreshIntervall : false,

	/**
	 * convert states from openHAB
	 *
	 * @param      item
	 * @param      state
	 */
	convertState: function (item, state) {
		io.debug && console.debug("io.convertState(item = " + item + ", state = " + state + ")");

		var transval = {
			"NULL"   : 0,
			"OFF"    : 0, "ON"   : 1,
			"CLOSED" : 0, "OPEN" : 1
		}

		switch (io.itemType[item]) {
			case "Color":
				return (state == "NULL") ? "0,0,0" : state;
			case "DateTime":
				if (state.slice(0, 9) == '1970-01-0') {
					state = new Date(Date.now()).toISOString().slice(0,10) + state.slice(10, 23);
				}
				var yyyy = parseInt(state.slice(0, 4));
				var mi = parseInt(state.slice(5, 7)) - 1;
				var dd = parseInt(state.slice(8, 10));
				var hh = parseInt(state.slice(11, 13));
				var mm = parseInt(state.slice(14, 16));
				var ss = parseInt(state.slice(17, 19));
				var ms = parseInt(state.slice(20, 23));
				return (state == "NULL") ? 0 : new Date(yyyy, mi, dd, hh, mm, ss, ms);
			case "Number":
				if (state.indexOf('000000') > 0) {
					state = state.slice(0, state.indexOf('000000'));
				}
				return parseFloat((state == "NULL") ? 0 : state);
			case "String":
				return (state == "NULL") ? "" : state;
			default:
				return (state in transval) ? transval[state] : state;
		}
	},

	log: {
		// refreshtimer in seconds
		timer            : 10,
		refreshIntervall : false,

		/**
		 * read log
		 */
		get: function () {
			widget.log().each(function () {
				var logname = $(this).attr('data-item');
				var logcount = $(this).attr('data-count');
				var cmd = "log:display -p '%p|%d{YYYY-MM-dd HH:mm:ss.SSS}|%c|%h{%m}%n'" + ((logname == 'default') ? ' -n ' + logcount : ' ' + logname);
				io.console(cmd, function(log){
					var newhash = log[0].id; //log[log.length-1].id
					var lasthash = null;
					if (widget.get(logname)) {
						var curlog = widget.get(logname);
						lasthash = curlog[0].id; //curlog[curlog.length-1].id
					}
					io.debug && console.debug("lasthash: "+lasthash);
					io.debug && console.debug("newhash:  "+newhash);
					if (newhash != lasthash) {
						io.debug && console.debug("io.run: widget.log.update(item = " + logname + ", value = " + log + ")");
						log = log.slice(0, logcount); //log.slice(0 - logcount)
						widget.update(logname, log);
					}
				});
			});
		}
	},

	plot: {
		items: new Array(),
		listeners: new Array(),
		// refreshtimer in seconds
		timer: 10,

		/**
		 * Initializion of plots
		 */
		init: function() {
			io.debug && console.log("io.plot.init()");

			io.plot.listeners = new Array();
			widget.plot().each(function(idx) {
				var items = widget.explode($(this).attr('data-item'));
				for (var i = 0; i < items.length; i++) {
					var plotItem = items[i];
					var pt = plotItem.split('.');
					if (!io.plot.items[plotItem] && (pt instanceof Array) && widget.checkseries(plotItem)) {
						if (pt[3] == 'now') {
							io.plot.listeners[pt[0]] = plotItem;
						}
						io.plot.get(plotItem);
						io.plot.items[plotItem] = true;
					}
				}
			});
		},

		/**
		 * read plotdata
		 *
		 * @param      plotItem
		 */
		get: function(plotItem) {
			io.debug && console.log("io.plot.get(plotItem = " + plotItem + ")");

			var pt = plotItem.split('.');
			var item = pt[0];
			var tmin = new Date().duration(pt[2]);
			var tmax = pt[3];

			var starttime = new Date(Date.now() - tmin);
			var url = io.url + "persistence/items/" + item + "?starttime=" + starttime.toISOString();

			if (tmax != 'now') {
				tmax = new Date().duration(pt[3]);
				var endtime = new Date(new Date() - tmax);
				url += "&endtime=" + endtime.toISOString();
			}

			$.ajax({
				url      : url,
				headers  : (io.auth !== false ? io.auth : {}),
				type     : 'GET',
				dataType : 'json',
				timeout  : io.timeout,
				async    : false,
				cache    : false
			}).done(function(persistence) {
				var plotData = new Array();
				if (persistence.data.length > 0) {
					$.each(persistence.data, function(key, data) {
						var val = io.convertState(item, data.state);
						if (isNaN(val)) {
							val = 0;
						} else if (Number(val) == val && val % 1 !== 0) { //isFloat
							val = parseFloat(val).toFixed(2);
						}
						plotData.push([data.time, parseFloat(val)]);
					});
					plotData.sort(function(a, b) {
						return a[0] - b[0];
					});
				} else {
					plotData.push([Date.parse(starttime), 0]);
					plotData.push([endtime ? Date.parse(endtime) : Date.now(), 0])
				}
				io.plot.items[plotItem] = Date.now();
				io.debug && console.debug("io.plot.get: widget.update(plotItem = " + plotItem + ", plotData = " + plotData + ")");
				widget.update(plotItem, plotData);
			}).fail(notify.json);
		}
	},

	/**
	 * Send a command to the console and return the response
	 *
	 * @param      command
	 * @return     response
	 */
	console: function (command, response) {
		io.debug && console.log("io.console(command = " + command + ")");
		$.ajax({
			url      : 'driver/openhab/console.php',
			data     : 'cmd=' + command,
			type     : 'POST',
			dataType : 'json',
			timeout  : io.timeout*2,
			async    : true,
			cache    : false
		}).done(function(data) {
			response(data);
		}).fail(notify.json);
	},

	/**
	 * stop all subscribed series
	 */
	stopseries: function () {
		io.debug && console.log("io.stopseries()");
		if (io.socket) {
			io.debug && console.debug("io.socket.close()");
			io.socket.close();
		}

		if (io.refreshIntervall) {
			clearTimeout(io.refreshIntervall);
			io.refreshIntervall = false;
		}

		if (io.log.refreshIntervall) {
			clearTimeout(io.log.refreshIntervall);
			io.log.refreshIntervall = false;
		}

		widget.log().each(function () {
			var logname = $(this).attr('data-item');
			if (log = widget.get(logname)) {
				log.length = 0;
			}
			widget.update(logname);
		});
	}
}