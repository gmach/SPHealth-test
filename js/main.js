//  Custom JQuery Utility to convert number representing money into text words
//  Author : Gavin Mach
jQuery.extend({
	moneyInWords: function toWords(s, isCent) {
		var th = ['','thousand','million','billion','trillion'];
		var dg = ['zero','one','two','three','four','five','six','seven','eight','nine'];
		var tn = ['ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
		var tw = ['twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
		s = s.replace(/[\, ]/g,'');
		if (s != parseFloat(s)) {
			return 'not a number';
		}
		var x = s.indexOf('.');
		var d = s.substr(0, x);
		var c = s.substr(x+1);
		if (x == -1) {
			x = s.length;
		}
		if (x > 15 ) {
			return 'too big';
		}
		var n = s.split('');
		var str = '';
		var sk = 0;
		for (var i=0; i < x; i++) {
			if ((x-i)%3==2) {
				if (n[i] == '1') {
					str += tn[Number(n[i+1])] + ' ';
					i++; sk=1;
				} else if (n[i]!=0) {
					str += tw[n[i]-2] + ' ';sk=1;
				}
			} else if (n[i]!=0) {
				str += dg[n[i]] +' ';
				if ((x-i)%3==0) str += 'hundred and ';sk=1;
			} if ((x-i)%3==1) {
				if (sk) str += th[(x-i-1)/3] + ' ';sk=0;
			}
		}
		if (!isCent) {
			if (d != "0") {
				str += ' dollar' + (d>1?'s':'') + (c>0?' and ':'');
			}
			if (x != s.length && c != "00") {
				str += toWords(c, true);
			}
		} else if (isCent) {
			str += ' cent' + (c>1?'s':'');
		}
		return str.replace(/\s+/g,' ');
	}
});

// Knockout ViewModel for Cheque 
function AppViewModel() {
    var self = this;
    self.name = ko.observable();
    self.date = ko.observable();
    self.amount = ko.observable();
	self.formattedAmount = ko.computed(function() {
		if (!isNaN(self.amount()) && self.amount()!="") {
			return accounting.formatNumber(self.amount(), {
				precision : 2,
				thousand : ","
			});
		}
    });
    self.textAmount = ko.computed(function() {
		if (!isNaN(self.amount()) && self.amount()!="") {
			var rounded = accounting.formatNumber(self.amount(), {
							precision : 2,
							thousand : ""
						});
			return $.moneyInWords(rounded, false);
		}
    });
}
ko.applyBindings(new AppViewModel());






