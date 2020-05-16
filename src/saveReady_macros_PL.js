const privateSave = {
  //---CONFIGURABLES---
  cheatPassage: false, //może być niezdefiniowane
  binKey: 3,
  maxFileSize: 512, //w KB
  extension: "sav", //bez '.' i małymi literami
  //---END OF CONFIGURABLES---
  a: (o, p) => {
    p = typeof p == "function" ? p : () => {};
    if (typeof o == "string") {
      return $(Selectors.story).append(Dialog(o, undefined, p));
    } else return null;
  },
  b: o => {
    var p = [];
    for (let r of Object.keys(localStorage)) {
      if (privateSave.l(r, true, false, true) === true) {
        if (r.slice(49).trim() === o) p.push(r, localStorage.getItem(r));
      }
    }
    if (p.length >= 2) {
      var s = p.join('\n');
      return s;
    } else {
      return null;
    }
  },
  c: o => {
    let p = State.serialise();
    if (typeof p === "string") return "(Saved Game " + privateSave.s + ") " + o + "\n" + p;
    return null;
  },
  d: (o, p, r) => {
    if (!o || !p || !r) return null;
    var s = new Blob([o], {
      type: p
    });
    var t = document.createElement('a');
    t.setAttribute('download', r);
    t.setAttribute('id', 'savedownload');
    t.setAttribute('href', URL.createObjectURL(s));
    t.dataset.downloadurl = [p, t.download, t.href].join(':');
    t.style.display = 'none';
    t.click();
    setTimeout(function () {
      URL.revokeObjectURL(t.href);
    }, 1500);
  },
  e: (o) => {
    let p = privateSave.s.split("-");
    o = privateSave.j(o, p[4]);
    let r = privateSave.g(o, p[0]);
    o = privateSave.h(o, r, p[1]+p[2]);
    o = privateSave.k(o, privateSave.binKey);
    return o;
  },
  f: (o) => {
    let p = privateSave.s.split("-");
    o = privateSave.k(o, privateSave.binKey);
    let [r, s] = privateSave.i(o, p[0].length, p[1]+p[2]);
    o = r;
    let t = privateSave.j(o, p[4], true);
    let u = privateSave.l(t, false, true, false);
    if (u === true) {
      if (s === privateSave.g(o, p[0])) {
        o = t;
        return o;
      } else return [null, "cheater"];
    } else return [null, u];
  },
  g: (o, p) => {
    var r = p.split("").map(x => x.charCodeAt(0));
    while(o.length % p.length != 0) o += ".";
    for (let i=0; i < o.length/p.length; i++) {
      for (let j=0; j < p.length; j++) {
        r[j] = (r[j]+o.charCodeAt(i*p.length+j)) % 128;
      }
    }
    var s = "";
    for (let i=0; i < p.length; i++) {
      s += String.fromCharCode(65 + (r[i] % 26));
    }
    return s;
  },
  h: (o, p, r) => {
    while (r.length < p.length) r += r;
    r = r.slice(0, p.length);
    var s = r.split("").map(x => x.charCodeAt(0));
    for (let i=0 ; i < p.length; i++) {
      if (s[i] < o.length) {
        o = o.slice(0, s[i]) + p[i] + o.slice(s[i]);
      } else{
        o += p[i];
      }
    }
    return o;
  },
  i: (o, p, r) => {
    while (r.length < p) r += r;
    r = r.slice(0, p);
    var s = r.split("").map(x => x.charCodeAt(0)).reverse();
    var t = "";
    for (let i=0 ; i < p; i++) {
      if (s[i] < o.length) {
        t += o[s[i]];
        o = o.slice(0, s[i]) + o.slice(s[i]+1);
      } else{
        t += o[o.length-1];
        o = o.slice(0, -1);
      }
    }
    t = t.split("").reverse().join("");
    return [o, t];
  },
  j: (o, p, r) => {
    p = p.length <= o.length ? p : p.slice(0, o.length);
    let s = 0;
    var t = "";
    for (let i=0; i < o.length; i++) {
      if (privateSave.r.includes(o[i])) {
        let x = privateSave.r.indexOf(o[i]);
        let y = privateSave.r.indexOf(p[(i-s) % p.length]);
        if (!r) {
          x = (x+y) % privateSave.r.length;
        } else {
          x -= y;
          if (x < 0) x += privateSave.r.length;
        }
        t += privateSave.r[x];
      } else {
        t += o[i];
        s++;
      }
    }
    return t;
  },
  k: (o, p) => {
    if (typeof p !== 'number') return o;
    p = p.toString();
    var r = '';
    o = o.toString();
    for (let i = 0; i < o.length; i++) {
      let s = o.charCodeAt(i);
      let t = s ^ p;
      r += String.fromCharCode(t);
    }
    return r;
  },
  l: (o, p, r, s) => {
    o = o.includes("\n") ? o.split("\n")[0] : o;
    let t = o.includes('Filename') ? o.slice(21, 57).trim() : o.slice(12, 48).trim();
    p = p ? !o.includes('Filename') : true;
    s = s ? o.slice(1, 11).trim() !== "Saved Game" : false;
    if ((o[0] !== "(" || o[6] !== " " || o[11] !== " ") || s) {
      if (r) privateSave.a("Nie można wczytać tego pliku - to nie jest zapis Twine!");
      return "corrupted_save_name";
    }
    if (t !== privateSave.s) {
      if (r) privateSave.a("Nie można wczytać tego zapisu - pochodzi z innej gry!");
      return "wrong_id";
    }
    if (!p) return "wrong_save_key";
    return true;
  },
  m: (o, p, r) => {
    return new Promise((a, b) => {
      r = Array.isArray(r) ? r : [r];
      var s = o.files[o.files.length - 1];
      if (s.name.slice(s.name.lastIndexOf(".")+1).toLowerCase() !== privateSave.extension) {
        privateSave.a("Nieprawidłowe rozszerzenie!");
        b("wrong_extension");
        return;
      }
      if (!s || (s.size / 1024) > privateSave.maxFileSize) {
        privateSave.a("Brak pliku/Zbyt duży plik!");
        b("none/too_large");
        return;
      }
      var t = new FileReader();
      t.readAsText(s);
      t.onload = c => {
        let u = c.target.result;
        if (u.length <= 50) {
          privateSave.a("Plik pusty/zbyt krótki, jak na save!");
          b("empty/too_short");
          return;
        }
        u = privateSave.f(u);
        if (Array.isArray(u)) {
          b(u[1]);
          return;
        }
        if (u.slice(1, 11) !== "Saved Game") {
          privateSave.a("Nie można wczytać tego zapisu - nie można go sprawdzić!");
          b("no_phrase");
          return;
        }
        var w = u.split('\n');
        if (w.length < 2) {
          privateSave.a("Nie można wczytać tego zapisu - nie da się go rozpakować!");
          b("no_line_break");
          return;
        }
        let x = w[0];
        var y = x.slice('49').trim();
        if (r.includes(y)) {
          if (!(State.deserialise(w[1]) instanceof Error)) { //if this returns true, we are absolutely sure, that save is gonna work
            localStorage.setItem("(Saved Game " + privateSave.s + ") " + p, w[1]);
            a(true);
          } else {
            privateSave.a("Nie można wczytać tego zapisu - jest nieprawidłowy!");
            b("corrupted_save_data");
          }
        } else {
          privateSave.a("Przepraszamy! Autor gry zablokował możliwość wczytania tego zapisu!");
          b("wrong_slot");
        }
      };
      t.onerror = () => {
        privateSave.a("Błąd odczytu pliku!");
        b("file_error");
      };
    });
  },
  n: (o, p) => {
    var r = privateSave.b(p);
    if (r) {
      r = privateSave.e(r);
      privateSave.d(r, "text/plain", o+"."+privateSave.extension);
    } else {
      privateSave.a("Nie można pobrać save'a który nie istnieje!");
      console.error(...privateSave.t, "Nie można pobrać save'a który nie istnieje!");
    }
  },
  o: (o, p) => {
    let r = privateSave.c(p);
    if (typeof r === "null") {
      privateSave.a("Nie udało się pobrać save'a - prawdopodobnie błąd Twine!");
      return null;
    }
    r = privateSave.e(r);
    privateSave.d(r, "text/plain", o+"."+privateSave.extension);
  },
  p: (o, p) => {
    var r = $('#saveupload')[0];
    if (!r) {
      r = document.createElement('input');
      r.setAttribute('type', 'file');
      r.setAttribute('id', 'saveupload');
      r.style.display = 'none';
      r.setAttribute('accept', "*."+privateSave.extension);
      r.setAttribute('size', '1');
      $(Selectors.passage).append(r);
    }
    r.addEventListener("change", () => {
      privateSave.m(r, o, p).then(() => {
        r.remove();
        Engine.showPassage(State.passage);
        console.log(...privateSave.t, "Wczytywanie powiodło się!");
      }).catch(s => {
        r.remove();
        console.error(...privateSave.t, "Nie udało się wczytać z pliku, z powodu:", s);
        if (s == "cheater") {
          if (privateSave.cheatPassage) Engine.goToPassage(privateSave.cheatPassage);
          else privateSave.a("Oszust!");
        }
      });
    }, {
      once: true
    });
    r.click();
  },
  r: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890",
  s: $('tw-storydata').attr('ifid'),
  t: ["%cSAVE TO FILE:", "font-weight: bold"]
};
Object.freeze(privateSave);
console.info(privateSave.t[0]+"%c Zapis do pliku gotowy!", privateSave.t[1], "color: green;");
const Macros = require("macros");
Macros.add("readfromfile", function(...a) {
  if (a.length > 1)  {
    let b = [];
    if (a.length > 2) b = a.slice(2, a.length-1);
    else b = [a[1]];
	  privateSave.p(a[1], b);
  }
	return {
		TwineScript_TypeName: "a (readfromfile:) operation",
    TwineScript_ObjectName: "a (readfromfile:) operation",
    TwineScript_Print: function () { return "" }
	}
}, [String, Macros.TypeSignature.zeroOrMore(Macros.TypeSignature.either(String))]);
Macros.add("savetofile", function(_, n, s) { 
  n = n.trim();
  while (n[n.length - 1] == ".") n = n.slice(0, n.length-1);
  if (n === "") return null;
	privateSave.n(n, s);
	return {
		TwineScript_TypeName: "a (savetofile:) operation",
    TwineScript_ObjectName: "a (savetofile:) operation",
    TwineScript_Print: function () { return "" }
	}
}, [String, String]);
Macros.add("savetofiledirect", function(_, n, s) {
  n = n.trim();
  while (n[n.length - 1] == ".") n = n.slice(0, n.length-1);
  if (n === "") return null;
  privateSave.o(n, s);
  return {
		TwineScript_TypeName: "a (savetofiledirect:) operation",
    TwineScript_ObjectName: "a (savetofiledirect:) operation",
    TwineScript_Print: function () { return "" }
	}
}, [String, String]);