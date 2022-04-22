export default interface NavigationItem {
  _id: number,
  label: string
  label_slug: string,
  children: NavigationItemChild[]
};

interface NavigationItemChild {
  value: {
    label: string,
    url: string
  }
  field: {
    type: string,
    label: string,
    options: {
      fields: NavigationItemChildSubField[]
    }
  }
}

interface NavigationItemChildSubField {
  name: string,
  type: string,
  label: string
}