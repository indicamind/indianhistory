import {DOCUMENT} from '@angular/common';
import {Injector,runInInjectionContext} from '@angular/core';
import {ScriptureProgressService} from './scripture-progress.service';
import {ScriptureBook} from './scriptures.service';

describe('Scripture reading progress',()=>{
  const book={slug:'bhagavad-gita',chapters:[{number:1,verseCount:47},{number:2,verseCount:72}]} as ScriptureBook;
  function setup(){
    const data=new Map<string,string>();
    const storage={getItem:(key:string)=>data.get(key)??null,setItem:(key:string,value:string)=>{data.set(key,value);}};
    const doc={defaultView:{localStorage:storage}};
    const create=()=>runInInjectionContext(Injector.create({providers:[{provide:DOCUMENT,useValue:doc}]}),()=>new ScriptureProgressService());
    return{data,doc,storage,create};
  }
  it('remembers the last place across reader instances and keeps books separate',()=>{
    const{create}=setup(),service=create();
    service.save(book.slug,2,35);
    expect(create().read(book)).toEqual({chapter:2,verse:35});
    expect(create().read({...book,slug:'another-book'})).toBeUndefined();
    service.save(book.slug,1,12);
    expect(create().read(book)).toEqual({chapter:1,verse:12});
  });
  it('ignores corrupt, outdated and out-of-range bookmarks',()=>{
    const{data,create}=setup(),service=create();
    for(const raw of ['not json','null','[]','{"chapter":99,"verse":1}','{"chapter":1,"verse":48}','{"chapter":1,"verse":0}','{"chapter":1,"verse":1.5}','{"chapter":"1","verse":1}']){
      data.set('ih_scripture_progress:'+book.slug,raw);
      expect(service.read(book)).toBeUndefined();
    }
  });
  it('keeps reading available when local storage is blocked or full',()=>{
    const{doc,storage,create}=setup(),service=create();
    storage.setItem=()=>{throw new Error('Quota exceeded');};
    service.save(book.slug,1,2);
    Object.defineProperty(doc.defaultView,'localStorage',{get:()=>{throw new Error('Blocked');}});
    expect(service.read(book)).toBeUndefined();
    service.save(book.slug,1,3);
  });
});
