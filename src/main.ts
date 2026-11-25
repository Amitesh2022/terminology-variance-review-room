import {LitElement,html,nothing,unsafeCSS} from 'lit'
import {repeat} from 'lit/directives/repeat.js'
import styles from './style.css?inline'
import './style.css'
import {Desk,select,categories,stages,value,formatDate,type State} from './desk'
const count=(state:State)=>Object.fromEntries(stages.map(stage=>[stage,state.records.filter(r=>r.stage===stage).length]))
class TerminologyDesk extends LitElement {
 static styles=unsafeCSS(styles)
 static properties={view:{state:true}}
 private desk=new Desk()
 private stop?:()=>void
 private unsubscribe?:()=>void
 declare private view:State
 constructor(){super();this.view=this.desk.state}
 connectedCallback(){super.connectedCallback();this.unsubscribe=this.desk.subscribe(s=>{this.view=s});this.stop=this.desk.start()}
 disconnectedCallback(){this.stop?.();this.unsubscribe?.();super.disconnectedCallback()}
 render(){
  const {desk,view:s}=this
  const visible=select(s.records,s.query,s.filter,s.sort)
  const totals=count(s)
  return html`
<header class="top"><div class="wrap bar"><a class="brand" href="#board"><span class="mark" aria-hidden="true">◇</span>Terminology Variance Review Room</a><nav aria-label="Workspace"><a href="#board" aria-current=${s.page==='board' ? 'page' : null}>Term queue</a><a href="#guide" aria-current=${s.page==='guide' ? 'page' : null}>Term review guide</a></nav></div></header>
<main class="wrap">
${s.page==='board'?html`
<section class="hero"><div><p class="eyebrow">LANGUAGE QUALITY / WORK QUEUE</p><h1>Terminology Variance Review Room</h1><p class="lead">Resolve disputed translations before terms are reused in public or customer-facing copy.</p></div><button type="button" @click=${(e:Event)=>{desk.edit()}}>New term review</button></section>
<section class="stats" aria-label="Term reviews by stage">${repeat(stages,stage=>stage,stage=>html`<div class="stat"><span class="stat-label">${stage}</span><strong>${totals[stage] ?? 0}</strong></div>`)}</section>
<section class="panel" aria-labelledby="term-queue"><div class="panel-head"><h2 id="term-queue">Term review queue</h2><span>${visible.length} visible</span></div>
<div class="filters"><label>Search records<input type="search" placeholder="Term, reviewer or equivalent" .value=${s.query} @input=${(e:Event)=>{desk.set({query:value(e)})}} /></label><label>Target language<select aria-label="Target language" .value=${s.filter} @change=${(e:Event)=>{desk.set({filter:value(e)})}}><option value="">All languages</option>${repeat(categories,x=>x,x=>html`<option .value=${x}>${x}</option>`)}</select></label><label>Sort by<select aria-label="Sort by" .value=${s.sort} @change=${(e:Event)=>{desk.set({sort:value(e)})}}><option value="due">Due date</option><option value="title">Title</option></select></label></div>
${s.success?html`<p role="status" class="success">${s.success}</p>`:nothing}
${s.error?html`<p role="alert">${s.error}</p><button type="button" @click=${(e:Event)=>{desk.load()}}>Reload list</button>`:nothing}
${s.loading?html`<p role="status">Loading records…</p>`:nothing}
${!s.loading && !s.error && visible.length===0?html`<p class="empty">No records match. Change the search or category.</p>`:nothing}
<ul class="records">${repeat(visible,row=>row.id,row=>html`<li><div><strong>${row.title}</strong><small>${row.owner} · ${row.context}</small><small class="measurement">Occurrences checked: ${row.amount}</small></div><span class="pill">${row.category}</span><span>${row.stage}</span><span>${formatDate(row.due)}</span><button type="button" class="secondary" @click=${(e:Event)=>{desk.edit(row)}} aria-label=${'Edit '+row.title}>Edit</button></li>`)}</ul></section>`:nothing}
${s.page==='editor'?html`<div class="inner"><a href="#board">← Back to term queue</a><p class="eyebrow">LANGUAGE QUALITY / RECORD</p><h1>${s.id?'Edit record':'New record'}</h1><form class="panel form" @submit=${(e:Event)=>{desk.save(e)}}>
<label>Term review title<input required type="text" maxLength="100" .value=${s.draft.title} @input=${(e:Event)=>{desk.field('title',e)}} /></label><label>Terminology reviewer<input required type="text" maxLength="80" .value=${s.draft.owner} @input=${(e:Event)=>{desk.field('owner',e)}} /></label><label>Target language<select aria-label="Target language" .value=${s.draft.category} @change=${(e:Event)=>{desk.field('category',e)}}>${repeat(categories,x=>x,x=>html`<option .value=${x}>${x}</option>`)}</select></label><label>Stage<select aria-label="Stage" .value=${s.draft.stage} @change=${(e:Event)=>{desk.field('stage',e)}}>${repeat(stages,x=>x,x=>html`<option .value=${x}>${x}</option>`)}</select></label><label>Proposed equivalent<input required type="text" maxLength="100" .value=${s.draft.context} @input=${(e:Event)=>{desk.field('context',e)}} /></label><label>Occurrences checked<input type="number" required min="1" max="500" step="1" .value=${s.draft.amount??''} @input=${(e:Event)=>desk.field('amount',e)} /></label><label>Due date<input required type="date"  .value=${s.draft.due} @input=${(e:Event)=>{desk.field('due',e)}} /></label>
<label class="wide">Usage evidence<textarea required maxLength="500" rows="3" .value=${s.draft.notes} @input=${(e:Event)=>{desk.field('notes',e)}}></textarea></label>
${s.error?html`<p role="alert" class="wide">${s.error}</p>`:nothing}
<div class="wide form-actions"><button type="submit" .disabled=${s.saving}>${s.saving?'Saving…':'Save record'}</button><a href="#board">Cancel</a></div></form></div>`:nothing}
${s.page==='guide'?html`<div class="inner"><p class="eyebrow">LANGUAGE QUALITY / PLAYBOOK</p><h1>Make the choice traceable</h1><article class="panel guide"><h2>Review checklist</h2><p>Compare the proposed equivalent with authoritative examples for the same concept. Explain when a synonym should not be used before accepting an entry.</p><h2>Before closing a record</h2><p>Record the source or usage example supporting the final choice. Nothing is exported to a live translation service.</p><a href="https://translation.ec.europa.eu/languages-and-translation-european-commission/terminology_en">Read the official background</a></article></div>`:nothing}
</main><footer class="wrap footer">Terminology Variance Review Room <span>·</span> Sample workspace</footer>`
 }
}
customElements.define('terminology-desk',TerminologyDesk)
document.getElementById('app')!.append(document.createElement('terminology-desk'))
