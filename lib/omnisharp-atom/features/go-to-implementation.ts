import Omni = require('../../omni-sharp-server/omni')
import OmniSharpAtom = require('../omnisharp-atom')

class GoToImplementation {
    private disposable: { dispose: () => void; }
    private atomSharper: typeof OmniSharpAtom;

    constructor(atomSharper: typeof OmniSharpAtom) {
        this.atomSharper = atomSharper;
    }

    public goToImplementation() {
        Omni.client.findimplementationsPromise(Omni.makeRequest());
    }

    public activate() {
        this.disposable = atom.workspace.observeTextEditors((editor) => { });

        this.atomSharper.addCommand("omnisharp-atom:go-to-implementation", () => {
            return this.goToImplementation();
        });

        Omni.registerConfiguration(client => {
            client.observeFindimplementations.subscribe((data) => {
                if (data.response.QuickFixes.length == 1) {
                    Omni.navigateTo(data.response.QuickFixes[0]);
                } else {
                    this.atomSharper.outputView.selectPane("find");
                }
            });
        });
    }

    public deactivate() {
        this.disposable.dispose()
    }
}
export = GoToImplementation
