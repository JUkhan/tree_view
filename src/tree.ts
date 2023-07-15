import * as d3 from 'd3';
import {treeData, dynamicName} from './treeData';
import { ccpdt_validation } from './ccpdt'
export function treeView() {
  const body = d3.select('body');
  body.append('h3').text('Tree View');
  const topNav = body.append('div');
  const countries = ['Bangladesh', 'India', 'Pakistan'];
  const canvas = body.append('ul');
  loadData(canvas, countries);
  topNav
    .append('button')
    .text('Add')
    .on('click', () => {
      countries.push(Math.random().toString(32).slice(2));
      loadData(canvas, countries);
    });
  topNav
    .append('button')
    .text('Update')
    .call((m) =>
      m.on('click', () => {
        countries[1] = 'Japan';
        loadData(canvas, countries);
      })
    );
  topNav
    .append('button')
    .text('Remove')
    .on('click', () => {
      countries.shift();
      loadData(canvas, countries);
      console.log(d3.event.layerX);
    });
  hview(body);
}

function loadData(canvas: any, data: any) {
  canvas
    .selectAll('li')
    .data(data, (d) => d)
    .join(
      (node) =>
        node
          .append('li')
          .style('color', 'blue')
          .text((d) => d),
      (node) => node.style('color', 'red').text((d) => d),
      (node) => node.remove()
    );
  /*const u=canvas.selectAll('li').data(data, d=>d);
  u.enter().append('li')
  .classed('new', 'true')
  .merge(u)
  .text(d=>d)
  u.exit().remove();*/
}
interface INodePoint {
  x: number;
  y: number;
}
const diagonal = (s: INodePoint, d: INodePoint): string =>
  `M ${s.y} ${s.x}
     C ${(s.y + d.y) / 2} ${s.x},
      ${(s.y + d.y) / 2} ${d.x},
      ${d.y} ${d.x}`;

let selectedNode=null;
let root,canvas, treeLayout, menu;
function hview(body) {
  body.append('p').style('border-bottom', 'solid 1px pink');
  body.append('button').text('Zoom In').on('click',()=>manageZoom(1.25));
  body.append('button').text('Zoom Out').on('click',()=>manageZoom(0.8));
  body.append('button').text('CCPDT Validation').on('click',()=>{
    body.select('ul').html(ccpdt_validation(treeData as any).map(el=>`<li>${el}</li>`).join(''));
  });
   canvas = body
    .append('svg')
    .attr('class','tree')
    .attr('width', 1200)
    .attr('height', 800)
    .append('g')
    .attr('id', 'idg')
    .attr('transform', 'translate(50,50)');
  
  /*canvas.append('path').attr('fill','none').attr('stroke','red')
  .attr('d', diagonal({x:10,y:10},{x:10, y:100}))*/
   treeLayout = d3.tree().size([700, 1000]);
  root = d3.hierarchy(treeData);
   menu = body.select('.box').style('display', 'none');
  body.on('click', () => menu.style('display', 'none'));
  menu.select('.all').on('click',()=>{
    console.log(selectedNode)
    selectedNode.data._children=selectedNode.data.children;
   selectedNode.data.children=null;
    updateTreeView(treeData)
  })
  menu.select('.imm').on('click',()=>{
    console.log(selectedNode);
    if(selectedNode.height<2)return;
    let immChildren=selectedNode.data.children.filter(d=>d.children).map(d=>d.children).flat();
    let dic=new Map();
    immChildren=immChildren.reduce((res, el)=>{
      if(!dic.has(el.name)){
        dic.set(el.name, true);
        res.push(el);
      }
      return res;
    },[])
    selectedNode.data._children=selectedNode.data.children;

    selectedNode.data.children=[{id:dynamicName(), isImmediate:true, count:selectedNode.data.children.length, name:'ddd', children:immChildren}];
     updateTreeView(treeData)
  })
  menu.select('header').on('click',()=>{
    if(!selectedNode.data._children)return;
   selectedNode.data.children=selectedNode.data._children;
   selectedNode.data._children=null;
    updateTreeView(treeData)
  })
  updateTreeView(treeData)
   
}
function updateTreeView( treeData){
  console.log(treeData);
  root = d3.hierarchy(treeData);
  const x=treeLayout(root);
  //console.log(x,'');
  // Compute the new tree layout.
  //const nodes = tData.descendants();
  //const links = nodes.slice(1);
  //console.log(root.descendants())
  let tvData=x.descendants();
  let linkData=x.links();

  //const u=canvas.selectAll('.node');

  const node = canvas
    .selectAll('.node')
    .data(tvData,d=>d.id);
    
  
  const nodeEnter=node
    .attr('transform', (d) => `translate(${d.y}, ${d.x})`)
    .enter()
    .append('g')
    .classed('node', true)
    .attr('transform', (d) => `translate(${d.y}, ${d.x})`);
  //update node
  //node.attr('transform', (d) => `translate(${d.y}, ${d.x})`);
  
  node.exit().remove();

  renderCircle(nodeEnter);
  rendText(nodeEnter, menu);

  const links=canvas
    .selectAll('path.link')
    .data(linkData);

  renderLinks(links);
  removeLinks(links);
  
}
function renderCircle(node){

  node
  .append('circle')
  .style("stroke", d=>d.data.isImmediate?"white":"green")
  .style("stroke-width",3)
  .on('click',d=>{
    if(!(d.data.isExpand || d.data.isImmediate)){
    d.data.isExpand=true;
    d.data.children= [
      {
        id:dynamicName(),
        name:dynamicName(),
        isExpand:false
      },
      {
        id:dynamicName(),
        name: dynamicName(),
        isExpand:false,
      },
    ]
    //treeData={...treeData}
    console.log(treeData);
    updateTreeView(treeData)
  }
    
  })
  .style('cursor', 'pointer')
  .attr('r', 10)
  .attr('fill', d=>d.data.isImmediate?'yellow':d.data.isExpand?'white':'green')
  .append('title').text(d => d.data.isImmediate?`${d.data.count} Node${d.data.count>1?'s':''}`: d.data.name)
 
}
function rendText(node, menu){
  node.filter(d=>!d.data.isImmediate)
  .append('text')
  .classed('node-name', true)
  .style('cursor', 'pointer')
  .text((d) => d.data.name)
  .attr('text-anchor','middle')
  .attr('transform', 'translate(0,-15)')
  .on('click', (d) => {
    //if(d.height==0)return
    d3.event.stopPropagation();
    selectedNode=d;
    if(d.data._children){
      menu.select('header').text('View').classed('header-action',true);
      menu.select('section').style('display', 'none');
    }else{
      menu.select('header').text('Hide').classed('header-action',false);
      menu.select('section').style('display', 'block');
    }
    menu
      .style('display', 'inline-block')
      .style("top", d3.event.y+window.scrollY+10 + 'px')
          .style("left", d3.event.x-20 + 'px')
      
  });
  
}
function renderLinks(links){
  
  links.enter()
  .insert('path','g')
  .classed('link', true)
  .attr('fill', 'none')
  .attr('stroke', 'gray').merge(links)
  .attr('d', (d) => diagonal({x:d.source.x, y:d.source.y+10},{x:d.target.x, y:d.target.y-10}));
}

function removeLinks(links){
  links.exit().remove();
}
let zoom=null;
function initZoom(): void {
  d3.select('svg.tree').call(zoom);
}

function defineZoom(): void {
  zoom = d3.zoom()
  .scaleExtent([0.125, 4])
  .on('zoom', zoomFn).filter(() => {
    if (d3.event && (d3.event.type === 'dblclick' || d3.event.type === 'wheel')) {
      return false;
    }
    return true;
  });
}

function zoomFn() {
  if (d3.event.transform !== null) {
    canvas.attr('transform', d3.event.transform);
  }
}


function manageZoom(zoomRatio: number): void {
 
  defineZoom();
  initZoom();
  d3.select('svg')
    .transition().call(zoom.scaleBy, zoomRatio);
}