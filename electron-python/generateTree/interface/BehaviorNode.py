class BehaviorNode:
    def __init__(self, id, name):
        self.id = id
        self.name = name
        self.children = []
        self.params = {}

    def appendChild(self, child):
        self.children.append(child)
        child.parent = self

    def removeChild(self, child):
        self.children.remove(child)
        child.parent = None

    def child(self, row):
        return self.children[row]

    def childCount(self):
        return len(self.children)
