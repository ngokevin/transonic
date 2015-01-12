import os

from fabric.api import env, execute, lcd, local, parallel, roles, task
import fabdeploytools.envs
from fabdeploytools import helpers

import deploysettings as settings

env.key_filename = settings.SSH_KEY
fabdeploytools.envs.loadenv(os.path.join('/etc/deploytools/envs',
                                         settings.CLUSTER))
TRANSONIC = os.path.dirname(__file__)
ROOT = os.path.dirname(TRANSONIC)


@task
def pre_update(ref):
    with lcd(TRANSONIC):
        local('git fetch')
        local('git fetch -t')
        local('git reset --hard %s' % ref)


@task
def build():
    with lcd(TRANSONIC):
        local('npm install')
        local('make install')
        local('cp src/media/js/settings_local_hosted.js '
              'src/media/js/settings_local.js')
        local('make build')
        local('node_modules/.bin/commonplace langpacks')


@task
def deploy_jenkins():
    rpm = helpers.build_rpm(name='transonic',
                            env=settings.ENV,
                            cluster=settings.CLUSTER,
                            domain=settings.DOMAIN,
                            root=ROOT)

    rpm.local_install()
    rpm.remote_install(['web'])


@task
def update():
    with lcd(TRANSONIC):
        local('npm install')
        local('make install')
        local('cp src/media/js/settings_local_hosted.js src/media/js/settings_local.js')
        local('make build')
        local('node_modules/.bin/commonplace langpacks')


@task
@roles('web')
@parallel
def _install_package(rpmbuild):
    rpmbuild.install_package()


@task
def deploy():
    with lcd(TRANSONIC):
        ref = local('git rev-parse HEAD', capture=True)

    rpmbuild = helpers.deploy(name='transonic',
                              env=settings.ENV,
                              cluster=settings.CLUSTER,
                              domain=settings.DOMAIN,
                              root=ROOT,
                              deploy_roles=['web'],
                              package_dirs=['transonic'])
