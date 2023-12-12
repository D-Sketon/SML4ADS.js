# -*- coding: utf-8 -*-

__author__ = "Benjamin Orthen, Stefan Urban"
__copyright__ = "TUM Cyber-Physical Systems Group"
__credits__ = ["Priority Program SPP 1835 Cooperative Interacting Automobiles"]
__version__ = "1.0.2"
__maintainer__ = "Benjamin Orthen"
__email__ = "commonroad-i06@in.tum.de"
__status__ = "Released"


class OpenDrive:
    def __init__(self):
        self._roads = []
        self._junctions = []

    @property
    def roads(self):
        """ """
        return self._roads

    def getRoad(self, id_):
        """

        Args:
          id_:

        Returns:

        """
        for road in self._roads:
            if road.id == id_:
                return road

        return None

    @property
    def junctions(self):
        """ """
        return self._junctions

    def getJunction(self, junctionId):
        """

        Args:
          junctionId:

        Returns:

        """
        for junction in self._junctions:
            if junction.id == junctionId:
                return junction
        return None
