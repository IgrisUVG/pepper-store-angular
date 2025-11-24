function Rendererable(props: {
  template: string,
  container: HTMLElement
}) {
  return function (target: any) {
    target.prototype._template = function () {
      return props.template;
    }

    target.prototype._render = function () {
      props.container.innerHTML = this._template();
    }
  }
}

@Rendererable({
  container: document.body,
  template: `<div>Component</div>`
})
class Component { }

const component = new Component();
