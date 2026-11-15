"use strict";
const $ = (selector) => document.querySelector(selector);
const menu = $('#menu-toggle');
if (menu) menu.addEventListener('click', () => {
  const open = $('#site-nav').classList.toggle('open'); menu.setAttribute('aria-expanded', String(open));
});
const savedTheme = localStorage.getItem('abigail-theme');
if (savedTheme === 'dark') document.documentElement.dataset.theme = 'dark';
$('#theme-toggle')?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; localStorage.setItem('abigail-theme', next);
});
if ($('#year')) $('#year').textContent = new Date().getFullYear();
function readList(key) {
  try {
    const x = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(x) ? x : [];
  }
  catch {
    return [];
  }
}
function saveList(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}
const taskForm = $('#task-form');
if (taskForm) {
  const key = 'abigail-tasks-v2';
  let tasks = readList(key);
  const list = $('#task-list');
  function render() {
    list.replaceChildren();
    tasks.forEach(task => {
      const li = document.createElement('li'); const check = document.createElement('input'); check.type='checkbox'; check.checked=task.completed; check.setAttribute('aria-label', 'Complete '+task.text); check.addEventListener('change', () => {
        task.completed=check.checked; saveList(key,tasks); render();
      }); const span=document.createElement('span'); span.textContent=task.text; if(task.completed) span.className='completed'; const del=document.createElement('button'); del.type='button'; del.textContent='Delete'; del.setAttribute('aria-label','Delete '+task.text); del.addEventListener('click',()=> {
        tasks=tasks.filter(x=>x.id!==task.id);saveList(key,tasks);render();
      }); li.append(check,span,del);list.append(li);
    });
    const completed=tasks.filter(x=>x.completed).length;
    $('#task-count').textContent=tasks.length+' TASK'+(tasks.length===1?'':'S');
    $('#progress-fill').style.width=(tasks.length?completed/tasks.length*100:0)+'%';
    $('#progress-label').textContent=tasks.length?completed+' of '+tasks.length+' tasks completed':'Add a task to get started.';
    $('#empty-state').hidden=tasks.length>0;
  }
  taskForm.addEventListener('submit',e=> {
    e.preventDefault();const input=$('#task-input');const value=input.value.trim();if(!value)return;tasks.push( {
      id:crypto.randomUUID?.()||String(Date.now()+Math.random()),text:value,completed:false
    });saveList(key,tasks);input.value='';render();input.focus();
  });
  render();
}
const contact=$('#contact-form');
if(contact) contact.addEventListener('submit',e=> {
  e.preventDefault();const name=$('#name').value.trim(),email=$('#email').value.trim(),phone=$('#phone').value.trim(),message=$('#message').value.trim(),feedback=$('#form-feedback');feedback.style.color='';if(!name||!email||!phone||!message) {
    feedback.textContent='Please fill in every field.';return;
  }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    feedback.textContent='Please enter a valid email address.';return;
  }
  if(!/^\d+$/.test(phone)) {
    feedback.textContent='Please use digits only for the phone number.';return;
  }
  feedback.textContent='All checks passed! This is a demonstration form and your message was not sent.';feedback.style.color='var(--accent)';
});
const marksForm=$('#marks-form');
if(marksForm) marksForm.addEventListener('submit',e=> {
  e.preventDefault();const values=['#mark-one','#mark-two','#mark-three'].map(s=>$(s).value.trim());const marks=values.map(Number);$('#average-result').textContent=values.some(x=>x==='')||marks.some(x=>!Number.isFinite(x)||x<0||x>100)?'Please enter three valid marks from 0 to 100.':'Average mark: '+(marks.reduce((a,b)=>a+b,0)/3).toFixed(1)+'%';
});
const placesForm=$('#places-form');
if(placesForm) {
  const key='abigail-places-v1';
  let places=readList(key);
  const list=$('#places-list');
  function render() {
    list.replaceChildren();
    places.forEach(entry=> {
      const li=document.createElement('li'),div=document.createElement('div'),title=document.createElement('strong'),note=document.createElement('p'),del=document.createElement('button');title.textContent=entry.name;note.textContent=entry.note;del.textContent='Remove';del.type='button';del.addEventListener('click',()=> {
        places=places.filter(x=>x.id!==entry.id);saveList(key,places);render();
      });div.append(title,note);li.append(div,del);list.append(li);
    });
  }
  placesForm.addEventListener('submit',e=> {
    e.preventDefault();const name=$('#place-name').value.trim(),note=$('#place-note').value.trim();if(!name||!note)return;places.unshift( {
      id:Date.now()+Math.random(),name,note
    });saveList(key,places);placesForm.reset();render();
  });
  render();
}
const favorites=$$('.favorite-btn');
function $$(selector) {
  return [...document.querySelectorAll(selector)];
}
if(favorites.length) {
  const key='abigail-fashion-v1';
  let saved=readList(key);
  function render() {
    favorites.forEach(btn=> {
      const selected=saved.includes(btn.dataset.item);btn.textContent=selected?'♥ Saved to favorites':'♡ Save to favorites';btn.setAttribute('aria-pressed',String(selected));
    });
    $('#favorites-summary').textContent=saved.length+' collection'+(saved.length===1?'':'s')+' saved';
  }
  favorites.forEach(btn=>btn.addEventListener('click',()=> {
    const item=btn.dataset.item;saved=saved.includes(item)?saved.filter(x=>x!==item):[...saved,item];saveList(key,saved);render();
  }));
  render();
}
