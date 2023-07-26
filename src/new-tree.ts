import "./new-tree.css";
import * as d3 from 'd3';
import { treeData } from './treeData';

let root, canvas, treeLayout;
function treeView(body) {

    canvas = body
        .append('svg')
        .attr('class', 'tree')
        .attr('width', 400)
        .attr('height', 1200)
        .append('g')
        .attr('id', 'idg')
        .attr('transform', 'translate(100,50)');

    treeLayout = d3.tree().size([700, 1000]);
    root = d3.hierarchy(treeData);


    updateTreeView(treeData)

}

function updateTreeView(treeData) {

    root = d3.hierarchy(treeData);

    const x = treeLayout(root);

    let tvData = x.descendants();
    let linkData = x.links();

    //calculate node position
    let index = -1;
    root.eachBefore((n: any) => {
        n.x = n.depth * 30;
        n.y = ++index * 30;
    });


    const node = canvas
        .selectAll('.node')
        .data(tvData, d => d.id);

    console.log('tvData:', tvData);
    const nodeEnter = node
        .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
        .enter()
        .append('g')
        .classed('node', true)
        .attr('transform', (d) => `translate(${d.x}, ${d.y})`);
    //update node
    //node.attr('transform', (d) => `translate(${d.y}, ${d.x})`);

    node.exit().remove();

    renderCircle(nodeEnter);
    rendText(nodeEnter);

    console.log('links:', linkData)

    const links = canvas
        .selectAll('path.link')
        .data(linkData);

    renderLinks(links);
    removeLinks(links);

}
function renderCircle(node) {

    node
        .append('rect')
        .attr('width', d => d.data.name.length * 5.5 + 60)
        .attr('height', 25);


    node
        .append('circle')
        .style("fill", d => d.data.children ? "blue" : "orange")
        .attr('cx', d => hasChildren(d) ? 30 : 15)
        .attr('cy', 12)
        .attr('r', 8);


}
function hasChildren(d:any){
    return (d.data.children && d.data.children.length)||(d.data._children && d.data._children.length)
}
function rendText(node) {

    node.filter(hasChildren)
        .append('image')
        .attr('href',d => d.data.isExpand ? 'down.png' : 'right.png')
        .on('click',d=>{
            //d.data.isExpand =!d.data.isExpand;
            if(d.data.isExpand){
                d.data.isExpand=false;
                d.data._children=d.data.children;
                d.data.children=[];
            }else{
                d.data.isExpand=true;
                d.data.children=d.data._children;
                d.data._children=[]
            }
            updateTreeView(treeData);
        });
        //.attr('transform', 'translate(1, 0)');

    node
        .append('text')
        .text((d) => d.data.name)
        .attr('transform', d => `translate(${hasChildren(d) ? 45 : 30}, 16)`);


}
let diagonal = (d: any) =>
    `M${d.source.x + 12},${d.source.y + 25}
          V${d.target.y + 12}
          h${18}`;

function renderLinks(links) {

    links.enter()
        .insert('path', 'g')
        .classed('link', true)
        .attr('fill', 'none')
        .attr('stroke', 'blue').merge(links)
        .attr('d', diagonal);
}

function removeLinks(links) {
    links.exit().remove();
}



treeView(d3.select('body'));